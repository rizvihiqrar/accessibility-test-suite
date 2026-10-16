import AxeBuilder from '@axe-core/playwright';

export async function scanPage(page, options = {}) {
  let builder = new AxeBuilder({ page });
  if (options.tags?.length)  builder = builder.withTags(options.tags);
  if (options.rules?.length) builder = builder.withRules(options.rules);
  if (options.exclude) {
    const selectors = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
    for (const sel of selectors) builder = builder.exclude(sel);
  }
  return builder.analyze();
}

export function getCriticalViolations(violations) {
  return violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
}

export function formatViolations(violations) {
  if (!violations.length) return 'No violations';
  return violations
    .map(v =>
      `  [${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n` +
      `    Help: ${v.helpUrl}\n` +
      `    Nodes affected: ${v.nodes.length}`
    )
    .join('\n');
}
