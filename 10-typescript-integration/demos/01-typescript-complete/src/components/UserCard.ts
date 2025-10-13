import type { User } from "@/types/index";
import { formatUserName } from "@utils/helpers";

/**
 * 创建用户卡片
 */
export function createUserCard(user: User): HTMLDivElement {
  const card = document.createElement("div");
  card.className = "user-card";

  const name = document.createElement("h3");
  name.textContent = formatUserName(user);

  const details = document.createElement("div");
  details.className = "user-details";
  details.innerHTML = `
    <p><strong>ID:</strong> ${user.id}</p>
    <p><strong>邮箱:</strong> ${user.email}</p>
    ${user.age ? `<p><strong>年龄:</strong> ${user.age}</p>` : ""}
  `;

  card.appendChild(name);
  card.appendChild(details);

  return card;
}
