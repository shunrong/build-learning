import type { ButtonConfig } from "@/types/index";

/**
 * 创建按钮
 */
export function createButton(config: ButtonConfig): HTMLButtonElement {
  const { text, onClick, variant = "primary", disabled = false } = config;

  const button = document.createElement("button");
  button.textContent = text;
  button.className = `demo-button demo-button--${variant}`;
  button.disabled = disabled;

  button.addEventListener("click", () => {
    console.log(`按钮"${text}"被点击`);
    onClick();
  });

  return button;
}
