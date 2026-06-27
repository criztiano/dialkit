import type { CurveSegment, CurveDriver, DriverDirection } from '../../curve-composer-core';
type $$ComponentProps = {
    segments: CurveSegment[];
    driver?: CurveDriver | null;
    direction?: DriverDirection;
    onSegmentsChange?: (segments: CurveSegment[]) => void;
    onDriverChange?: (driver: CurveDriver) => void;
    getPhase?: () => number;
    phase?: number;
    mode?: 'continuous' | 'trigger';
    triggerSteps?: number;
    onTrigger?: (index: number) => void;
    curveColor?: string;
    playheadColor?: string;
    grid?: boolean;
    gridSubdivisions?: number;
    width?: number;
    height?: number;
};
declare const CurveComposer: import("svelte").Component<$$ComponentProps, {}, "">;
type CurveComposer = ReturnType<typeof CurveComposer>;
export default CurveComposer;
//# sourceMappingURL=CurveComposer.svelte.d.ts.map