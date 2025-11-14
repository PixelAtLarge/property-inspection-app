# Claude Code Instructions for Property Inspection App

## Git Commit Strategy

**IMPORTANT: Commit code regularly throughout our work sessions.**

### When to Commit

Create a git commit after completing any of the following:

1. **Feature Additions**: After implementing a new feature or screen
2. **Bug Fixes**: After fixing a bug or resolving an issue
3. **UI Updates**: After making significant UI/styling changes
4. **Data Structure Changes**: After modifying types, interfaces, or data models
5. **Multiple Related Changes**: After making 2-3 related changes that form a logical unit
6. **End of Request**: After completing a user's request that involved code changes

### Commit Message Format

Use clear, descriptive commit messages following this pattern:

```
<type>: <short description>

<optional detailed description if needed>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types to use:**
- `feat`: New feature
- `fix`: Bug fix
- `style`: UI/styling changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `docs`: Documentation updates

### Examples

```
feat: Add photo annotation functionality to inspection screen

Implemented ability to add tags/annotations to photos with description text
and coordinate tracking for each annotation point.
```

```
fix: Persist measurement data in floor plan structure

Measurements were saving to local state but not being included in the
floorPlan when saving inspections. Updated handleSave to build proper
FloorPlan structure from rooms and roomMeasurements state.
```

```
style: Update location text format to use degree symbols

Changed coordinate display from "37.77, -122.42" to "37.77° N, 122.42° W"
for better geographic representation.
```

### Git Workflow

Before committing, always:
1. Run `git status` to see what files have changed
2. Run `git diff` to review the specific changes
3. Add relevant files with `git add <files>`
4. Create the commit with a descriptive message
5. Run `git status` after to confirm success

### What NOT to Commit

- `node_modules/` directory
- Build artifacts (`build/`, `android/app/build/`, etc.)
- Environment files (`.env` files)
- IDE/editor specific files (`.vscode/`, `.idea/`)
- iOS build files (`ios/Pods/`, `*.xcworkspace/xcuserdata/`)
- Temporary files

These should already be in `.gitignore`.

## Project-Specific Notes

This is a React Native property inspection app with the following key areas:

- **Screens**: HomeScreen, InspectionDetailScreen, PropertyDetailsScreen, YourInspectionsScreen, FavoritesScreen
- **Key Features**: Property search, inspections with photos/notes/measurements, favorites management
- **Storage**: AsyncStorage for local data persistence
- **Navigation**: React Navigation with native stack

When making changes, be mindful of:
- Data persistence in AsyncStorage
- Navigation parameter passing between screens
- Photo annotation data structure
- FloorPlan/Room measurement data
- Favorites context state management
