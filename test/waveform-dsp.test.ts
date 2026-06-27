import { describe, it, expect } from 'vitest';
import { mixToMono, fillPeaks, envelope, type Peaks } from '../src/waveform-dsp';

// mixToMono only touches numberOfChannels, length, and getChannelData(c), so a
// hand-built object exposing those three stands in for a real Web Audio AudioBuffer.
// All sample values below are exact in float32 (multiples of a small power of two)
// so the results compare exactly — no precision fuzz needed.
function fakeBuffer(channels: number[][]): AudioBuffer {
  const data = channels.map((c) => Float32Array.from(c));
  return {
    numberOfChannels: data.length,
    length: data[0]?.length ?? 0,
    getChannelData: (c: number) => data[c],
  } as unknown as AudioBuffer;
}

describe('mixToMono', () => {
  it('passes a mono buffer straight through (returns the channel itself, no copy)', () => {
    const buf = fakeBuffer([[0.5, -0.25, 0.75]]);
    const mono = mixToMono(buf);
    expect(Array.from(mono)).toEqual([0.5, -0.25, 0.75]);
    // single channel: hands back the source array rather than allocating a new one
    expect(mono).toBe(buf.getChannelData(0));
  });

  it('averages two channels sample-by-sample (stereo → mono)', () => {
    const mono = mixToMono(
      fakeBuffer([
        [1, 0, 0.5],
        [0, 0.5, -0.5],
      ]),
    );
    // ((1+0)/2, (0+0.5)/2, (0.5-0.5)/2)
    expect(Array.from(mono)).toEqual([0.5, 0.25, 0]);
  });

  it('averages across more than two channels', () => {
    const mono = mixToMono(
      fakeBuffer([
        [1, 0],
        [0, 0],
        [1, 1],
        [0, -1],
      ]),
    );
    // ((1+0+1+0)/4, (0+0+1-1)/4)
    expect(Array.from(mono)).toEqual([0.5, 0]);
  });
});

describe('fillPeaks', () => {
  it('captures the min and max within each column range', () => {
    const data = Float32Array.from([0.5, -0.25, 0.75, -0.5, 0.25, -0.125]);
    const min = new Float32Array(2);
    const max = new Float32Array(2);
    fillPeaks(data, 2, min, max);
    // col 0 spans [0.5, -0.25, 0.75]; col 1 spans [-0.5, 0.25, -0.125]
    expect(Array.from(min)).toEqual([-0.25, -0.5]);
    expect(Array.from(max)).toEqual([0.75, 0.25]);
  });

  it('with one column per sample, min equals max equals that sample', () => {
    const data = Float32Array.from([0.5, -0.25, 0.75]);
    const min = new Float32Array(3);
    const max = new Float32Array(3);
    fillPeaks(data, 3, min, max);
    expect(Array.from(min)).toEqual([0.5, -0.25, 0.75]);
    expect(Array.from(max)).toEqual([0.5, -0.25, 0.75]);
  });

  it('keeps at least one sample per column when columns outnumber samples', () => {
    const data = Float32Array.from([0.5, -0.25]);
    const min = new Float32Array(4);
    const max = new Float32Array(4);
    fillPeaks(data, 4, min, max);
    // each column collapses onto a single source sample — no empty ranges / NaN
    expect(Array.from(min)).toEqual([0.5, 0.5, -0.25, -0.25]);
    expect(Array.from(max)).toEqual([0.5, 0.5, -0.25, -0.25]);
  });
});

describe('envelope', () => {
  const peaks: Peaks = {
    min: Float32Array.from([-0.25, -0.875, -0.125, -0.375]),
    max: Float32Array.from([0.5, 0.125, 0.75, 0.25]),
  };

  it('takes the peak amplitude max(|min|, |max|) over each segment', () => {
    // per-column amplitude: [0.5, 0.875, 0.75, 0.375]
    // n=2 over 4 cols -> segments [col0,col1] and [col2,col3] -> maxima 0.875, 0.75
    expect(envelope(peaks, 4, 2)).toEqual([0.875, 0.75]);
  });

  it('with one segment per column, returns the per-column amplitude', () => {
    expect(envelope(peaks, 4, 4)).toEqual([0.5, 0.875, 0.75, 0.375]);
  });

  it('handles more segments than columns without leaving gaps', () => {
    const p: Peaks = {
      min: Float32Array.from([-0.5, 0.25]),
      max: Float32Array.from([0.75, -0.125]),
    };
    // 4 segments over 2 cols -> segments map onto cols 0,0,1,1
    expect(envelope(p, 2, 4)).toEqual([0.75, 0.75, 0.25, 0.25]);
  });
});
