# Fix Push Error - Quick Solution

## The Problem
You're on branch `master` but GitHub uses `main`, or the remote has commits you don't have locally.

## Quick Fix

Run these commands in order:

```bash
# 1. Rename branch to main
git branch -M main

# 2. Try to pull first (if remote has commits)
git pull origin main --allow-unrelated-histories

# 3. If pull succeeds, push
git push -u origin main
```

## If Pull Fails or Has Conflicts

If the pull fails or you get conflicts, you can force push (only if you're sure remote doesn't have important data):

```bash
# Force push (overwrites remote)
git branch -M main
git push -u origin main --force
```

⚠️ **Warning**: `--force` will overwrite anything on the remote. Only use if the remote repository is empty or you don't care about its contents.

## Alternative: Start Fresh

If you want to start completely fresh:

```bash
# Remove remote
git remote remove origin

# Add remote again
git remote add origin https://github.com/susanelv-wq/virtual-clothing-tryon.git

# Rename to main
git branch -M main

# Force push
git push -u origin main --force
```

## Most Likely Solution

Since you already have a commit, just run:

```bash
git branch -M main
git push -u origin main --force
```

This will push your local code to GitHub, overwriting any initial README or other files GitHub might have created.
