# Fix Push Error

## Common Causes

The error "failed to push some refs" usually happens when:
1. The remote repository has commits (like README) that your local doesn't have
2. Branch name mismatch (master vs main)
3. You need to pull first, then push

## Solution

### Option 1: Force Push (if remote is empty or you want to overwrite)

```bash
# Rename branch to main
git branch -M main

# Force push (only if you're sure remote doesn't have important data)
git push -u origin main --force
```

### Option 2: Pull and Merge (Recommended)

```bash
# Fetch remote changes
git fetch origin

# Rename branch to main
git branch -M main

# Pull and merge (if remote has commits)
git pull origin main --allow-unrelated-histories

# Resolve any conflicts if needed, then:
git push -u origin main
```

### Option 3: If Remote Has Only README

```bash
# Pull the README
git pull origin main --allow-unrelated-histories

# If there are conflicts, resolve them, then:
git add .
git commit -m "Merge remote README"
git push -u origin main
```

## Quick Fix Command

Run this to fix the most common issue:

```bash
git branch -M main
git pull origin main --allow-unrelated-histories
git push -u origin main
```

If that doesn't work, try:

```bash
git branch -M main
git push -u origin main --force
```

⚠️ **Warning**: `--force` will overwrite remote changes. Only use if you're sure!
