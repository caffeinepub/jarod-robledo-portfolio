# Jarod Robledo Portfolio

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public-facing portfolio website for Jarod Robledo (architectural work, design, photography)
- Hero section with name/tagline
- Portfolio gallery page with filterable categories (All, Architecture, Interior Design, Renders)
- Lightbox/fullscreen image viewer for gallery photos
- About page with bio pulled from resume info
- Resume download button linking to the uploaded PDF
- Contact section with email and phone
- Admin panel (behind login) where Jarod can:
  - Upload new photos with title/category
  - Delete photos
  - Reorder photos
- All portfolio images stored via blob-storage so they persist and can be managed dynamically
- Initial seed photos uploaded from the provided assets

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Set up authorization (admin-only login for content manager)
2. Set up blob-storage for photo uploads
3. Backend: photo management (upload, list, delete, reorder), category tagging
4. Frontend public pages: Hero, Portfolio gallery with filter tabs, About, Contact
5. Frontend admin panel: photo upload form, photo grid with delete/reorder controls
6. Seed initial photos from uploaded assets on first load
7. Resume PDF accessible as downloadable asset
