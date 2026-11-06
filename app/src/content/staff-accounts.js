/**
 * Team accounts that can unlock the quiz. Only a salted PBKDF2 hash of each
 * password is stored here, never the password. Generate an entry with:
 *
 *   read -s PW && printf '%s' "$PW" | npm run account:new -- <email> "<label>"
 *
 * then paste the printed object into this list. An empty list means nobody can
 * sign in, so the app stays on the login screen.
 */
export const STAFF_ACCOUNTS = Object.freeze([
  { label: "Equipe 2", email: "cgomes@thoughtworks.com", salt: "c7be8D4oduSLOZ01o+QHqQ==", iterations: 600000, hash: "es3/P2fpfAQF90kHtkaAXxZnz6U5G63F++OCz0Ks7WI=" },
  { label: "Equipe 1", email: "alison.duarte@thoughtworks.com", salt: "cJuo4KxYkWQgxqLce1jVFA==", iterations: 600000, hash: "qXLca5esrni/mdOxnrzDEywH0Y1XdZjggbim89pUwcg=" },
]);
