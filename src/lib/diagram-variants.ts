import type { LayoutSpec } from './diagram';

type Breakpoint = 'all' | 'sm' | 'md-up' | 'lg-up' | 'xl-up' | 'md-only' | 'below-lg' | 'below-xl';

/** Where a diagram is shown. Tiles get scaled-down versions; row tiles get at most four boxes. */
export type DiagramContext = 'page' | 'feature' | 'pair' | 'row';

export interface DiagramLayouts {
  wide?: LayoutSpec;
  medium: LayoutSpec;
  narrow: LayoutSpec;
  /** At most four boxes. */
  compact: LayoutSpec;
}

export function variantsFor(
  context: DiagramContext,
  layouts: DiagramLayouts,
): Array<{ layout: LayoutSpec; show: Breakpoint }> {
  switch (context) {
    case 'page':
      return layouts.wide
        ? [
            { layout: layouts.wide, show: 'lg-up' },
            { layout: layouts.medium, show: 'md-only' },
            { layout: layouts.narrow, show: 'sm' },
          ]
        : [
            { layout: layouts.medium, show: 'md-up' },
            { layout: layouts.narrow, show: 'sm' },
          ];
    case 'feature':
      return [
        { layout: layouts.medium, show: 'md-up' },
        { layout: layouts.compact, show: 'sm' },
      ];
    case 'pair':
      return [
        { layout: layouts.medium, show: 'xl-up' },
        { layout: layouts.compact, show: 'below-xl' },
      ];
    case 'row':
      return [{ layout: layouts.compact, show: 'all' }];
  }
}
