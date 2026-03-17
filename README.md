# Mock-Book
Full-stack social media application with modern user experience. Discover users, follow them to see their content, and share your own posts.

👉 **[View deployed app](https://mock-book.vercel.app/)**

![Profile](./images/your_screenshot.png)
![Likes](./images/your_screenshot.png)
![Followers](./images/your_screenshot.png)


## Features

### Discover & Social
- Browse recent posts from users you follow (Following feed)
- Discover new users and their content (Discover feed)
- Search users by username
- Follow/unfollow users
- Remove followers from your account

### Content-Moderation
- Delete your own posts
- Delete your own comments
- Delete others' comments on your posts (post owner moderation)
- Edit profile (avatar, username, bio)

### Performance Features
- Infinite scroll on all feeds (posts, comments, likes, followers/following)
- Real-time cursor-based pagination
- Toast notifications for errors and success states
- Optimized image delivery via Cloudinary CDN

**Note:** See [Message-App](https://github.com/freddster14/Message-App) for testing and CI/CD implementation examples.

## Technical Decision

### Cursor-based pagination
- **Decision**: Implemented cursor-based pagination instead of offset pagination
- **Rationale**: Cursor pagination provides O(1) lookup performance by pointing directly to the last retrieved entry, while offset pagination requires iterating through all previous entries (O(n)). Critical for real-time feeds where new content is constantly added.
- **Implementation**: Used post, comment, like, and, user ID as cursor, enabling efficient "load more" functionality without performance degradation at scale.
- **Trade-off**: Cannot jump to arbitrary pages (e.g., page 3), but this limitation aligns with infinite scroll UX pattern.

### Virtuoso for infinite scroll
- **Decision**: Used react-virtuoso library for virtual scrolling
- **Rationale**: Delivers production-ready infinite scroll with built-in performance optimizations (DOM recycling, viewport rendering). Building custom intersection observer implementation would take 2-3 hours vs 30 minutes integration time.
- **Implementation**: Triggers endReached callback when user scrolls to bottom, fetches next cursor batch, tracks data length with useRef to detect end of list.
- **Trade-off**: Added dependency (~50KB) and less deep understanding of implementation details, but prioritized shipping speed for MVP.

### React Router Loaders for Data Fetching
- **Decision**: React Router loaders for route-level data fetching vs useEffect
- **Rationale**: Keeps data fetching logic separate from components, guarantees data availability before render, avoids managing loading states in every data-dependent component.
- **Implementation**: Router fetches data before component mount, passes as props/context. User clicks tab → route loads data → component renders with data ready.
- **Trade-off**: User waits for route transition vs seeing loading spinner immediately, but cleaner component architecture without null checks and loading state boilerplate in every component.

## Tech Stack
- **Frontend:** React, TypeScript, React Router, ShadCN, TailwindCSS, Virtuoso
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- **Authentication:** JWT, bcrypt, httpOnly cookies
- **Storage:** Cloudinary (images), Multer (file uploads)
- **Database:** Neon (PostgreSQL hosting)
- **Deployment:** Vercel (frontend), Render (backend)

## Quick Start

### Prerequisites
- Node.js
- PostgreSQL database
- Cloudinary account

### Setup
1. Clone and install dependencies
2. Configure environment variables (see `.env.example`)
3. Run database migrations
4. Build shared-types
5. Start backend and frontend

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## Known Limitations

- Testing and CI/CD not implemented (see [Message-App](https://github.com/freddster14/Message-App) for full test coverage example)
- Real-time updates require page refresh (no WebSocket implementation)
- Image cleanup not automated (orphaned images when users delete posts)

## License

MIT