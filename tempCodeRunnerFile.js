// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("swiftcart");

db.users.updateOne(
  { email: "lillianakoex@example.com" },
  { $set: { sellerCode: "SELL001" } }
)
