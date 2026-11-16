/** Focus the first form field when a dialog opens, without interrupting a user
 * who has already moved focus inside it during the entrance animation. */
export function focusDialogStart(node: HTMLElement | null, active: Element | null) {
  if (!node || node.contains(active)) return;
  const firstField = node.querySelector<HTMLElement>('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])');
  const firstButton = node.querySelector<HTMLElement>('button:not([disabled])');
  (firstField ?? firstButton ?? node).focus();
}
