# Mongoose Cheat Sheet: Blog API Edition

Welcome to your central repository for learning and revising Mongoose! This guide is tailored exactly to the operations you are using in your `Auth`, `Post`, and `Comment` services. 

Think of Mongoose as your translator: you speak JavaScript objects, Mongoose translates them into MongoDB queries.

---

## 1. Creating Documents (The "Insert" Operations)

### `Model.create(data)`
**Where we use it:** Registering a new User, creating a new Post, adding a Comment.
**What to pass:** A JavaScript object that matches your Schema.
**What it returns:** A Promise that resolves to the newly created and fully populated document (including its new `_id`).

*Example from `auth.service.ts`:*
```typescript
const user = await User.create({
  name,
  email,
  password,
  role,
});
```
💡 **Memory Aid:** "Create" is the all-in-one package. It builds the object and saves it to the database in one single step.

---

## 2. Reading Documents (The "Find" Operations)

### `Model.findOne(criteria)`
**Where we use it:** Finding if an email is already registered, logging in, finding a Post by its slug.
**What to pass:** An object representing what you are searching for (e.g., `{ email: "test@test.com" }`).
**What it returns:** A Promise resolving to a **single** document, or `null` if nothing matches.

*Bonus Trick from `auth.service.ts`:*
```typescript
const user = await User.findOne({ email }).select('+password');
```
*Why `.select('+password')`?* In your User schema, password has `select: false` (hidden by default). The `+` forces Mongoose to bring it back just for this login check.

💡 **Memory Aid:** "FindOne" stops searching the database the millisecond it finds the very first match. It's fast and returns an Object, not an Array.

### `Model.findById(id)`
**Where we use it:** Before checking if a user owns a post/comment to delete or update it.
**What to pass:** A string ID (e.g., `postId`).
**What it returns:** A single document or `null`.

*Example from `post.service.ts`:*
```typescript
const post = await Post.findById(postId);
```
💡 **Memory Aid:** Think of it as a shortcut for `Model.findOne({ _id: id })`. 

### `Model.find(criteria)`
**Where we use it:** Getting all posts, getting my posts, getting comments for a post.
**What to pass:** A criteria object. If you pass an empty object `{}`, it finds *everything*.
**What it returns:** A Promise resolving to an **Array** of documents.

*Example from `post.service.ts` (with modifiers):*
```typescript
// Finding with a RegExp (Search function)
const posts = await Post.find({ title: { $regex: search, $options: 'i' } })
  .populate('author', 'name email avatar') // Joins the User data into the 'author' field!
  .skip(skip)   // For pagination: skips the first X results
  .limit(limit) // For pagination: only returns Y results
  .sort({ createdAt: -1 }); // Sorts by newest first
```
💡 **Memory Aid:** `find` always finds an Array `[]`. If there are no matches, it returns an empty array `[]` (not `null`).

### `Model.countDocuments(criteria)`
**Where we use it:** Calculating the `total` number of posts or comments for pagination.
**What to pass:** A criteria object (just like `.find()`).
**What it returns:** A Number (the mathematical count).

---

## 3. Updating Documents (The "Modify" Operations)

There are two primary ways you are updating records in your app.

### Way 1: The "Direct Database String" Update
`Model.findByIdAndUpdate(id, updateData)`
**Where we use it:** Quickly saving the Refresh Token cleanly in `auth.service.ts`.
**What to pass:** The `id` of the document, and an object of what fields to change.
**What it returns:** By default, it returns the document *BEFORE* the update happened. (Pass `{ new: true }` as a third argument if you want the updated version back).

```typescript
await User.findByIdAndUpdate(user._id, { refreshToken });
```

### Way 2: The "Fetch, Modify, Save" Approach (Instance Method)
**Where we use it:** Updating a post, or toggling a user's Like.
**How it works:** 
1. Find the document (`post = await Post.findById(postId)`)
2. Modify its properties in JS (`Object.assign(post, updateData)` or `post.likes.push(userId)`)
3. Call `.save()` on that specific document.

```typescript
// From post.service.ts
const post = await Post.findById(postId);
Object.assign(post, updateData); // Merges req.body into the document
await post.save(); // Saves it to DB
```
💡 **Memory Aid:** Use **Way 1** when you just need to hot-swap a single string blindly. Use **Way 2** when you need to perform logic (like checking if the user actually owns the post) before modifying it.

---

## 4. Deleting Documents (The "Remove" Operations)

### `document.deleteOne()`
**Where we use it:** Deleting posts and comments.
**How it works:** After you fetched a document using `findById`, you just call `.deleteOne()` directly on that document object.

```typescript
// From comment.service.ts
const comment = await Comment.findById(commentId);
// ... auth checks ...
await comment.deleteOne();
```
💡 **Memory Aid:** Treat the loaded document like a loaded gun. Once it's in your variable, `.deleteOne()` executes it.

---

## Quick Summary Cheatsheet for Revision:

| Action | Mongoose Method | Expected Return | Usage Example |
| :--- | :--- | :--- | :--- |
| **Read Single** | `.findOne({ ... })` | Object \| `null` | Checking email uniqueness |
| **Read Single (ID)**| `.findById("id")` | Object \| `null` | Finding a post before editing |
| **Read Multiple** | `.find({ ... })` | Array `[]` | Getting feed of posts |
| **Create** | `.create({ ... })` | Created Object | Registering a user |
| **Update Single** | `.findByIdAndUpdate("id", { ... })`| Previous Object | Quick token saving |
| **Update (Manual)**| `document.save()` | Updated Object | Adding a like to array |
| **Delete Single** | `document.deleteOne()` | Delete Result | Removing a bad comment |
| **Count** | `.countDocuments({ ... })` | Number | Calculating total pages |

Keep this file open when you code. Over time, these methods will become second nature!
