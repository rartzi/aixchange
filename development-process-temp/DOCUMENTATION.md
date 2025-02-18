# Documentation System Guide

## Overview
This documentation system is designed to provide a clear, maintainable, and comprehensive way to document software projects. It combines core documentation, templates, examples, and change tracking in a structured manner.

## Directory Structure
```
development-process/           # Documentation system
├── DOCUMENTATION.md          # This guide
├── templates/                # Documentation templates
├── examples/                # Example filled templates
└── scripts/                 # Documentation scripts

docs/                        # Generated documentation
├── core/                    # Core documentation
│   ├── README.md           # Project overview
│   ├── DEVELOPMENT.md      # Development guide
│   ├── PRODUCT.md          # Product & design
│   ├── ARCHITECTURE.md     # Technical design
│   ├── GOVERNANCE.md       # Security, privacy, licensing
│   └── VISION.md           # Strategic vision and objectives
└── tracking/               # Change tracking
    ├── CHANGELOG.md        # Version history
    ├── ROADMAP.md         # Project roadmap
    └── sessions/          # Sprint/milestone logs
```

## Documentation Flow
### 1. Core Documentation
- **README.md**: First point of contact, project overview
- **DEVELOPMENT.md**: Development setup, deployment, contribution guidelines
- **PRODUCT.md**: Product requirements, design system, user flows
- **ARCHITECTURE.md**: System architecture, technical decisions
- **GOVERNANCE.md**: Security, privacy, sustainability, licensing
- **VISION.md**: Strategic vision, objectives, and long-term goals
- **CODEBASE_SUMMARY.md**: Comprehensive codebase overview and patterns
- **CODEBASE_SUMMARY.md**: Comprehensive codebase overview and patterns

Update these when:
- New features are added
- Architecture changes
- Security policies update
- Design system changes

### 2. Change Tracking
- **CHANGELOG.md**: Automatically updated via git hooks
- **ROADMAP.md**: Update during sprint planning
- **Sessions/**: Create new log for each sprint/milestone

### 3. Templates
Templates provide structure for:
- Feature documentation
- API endpoints
- Component documentation
- Session logs
- Architecture decisions

## Using the System

### Setting Up
1. Run `development-process/scripts/setup-docs.sh` to create structure in /docs
2. Copy relevant templates from `development-process/templates/`
3. Reference examples in `development-process/examples/`

### Making Changes
1. Identify relevant documentation section
2. Use appropriate template
3. Update CHANGELOG.md (automatic via commit)
4. Update session log if significant

### Commit Messages
Format: `type(scope): message`

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Testing
- chore: Maintenance

Example: `feat(auth): Add OAuth support`

## LLM Instructions

### For Core Files
- README.md: Focus on clarity and quick start
- DEVELOPMENT.md: Step-by-step instructions
- PRODUCT.md: User-centric descriptions
- ARCHITECTURE.md: Technical accuracy
- GOVERNANCE.md: Policy clarity

### For Change Tracking
- CHANGELOG.md: Concise, meaningful entries
- ROADMAP.md: Clear priorities and timelines
- Session logs: Focus on decisions and progress

### Template Usage
Templates are located in development-process/templates/ and include:
- Required sections
- Example content
- Update triggers
- Validation rules

## Maintenance

### Regular Updates
1. Review core docs monthly
2. Archive old session logs
3. Update templates as needed
4. Validate documentation links

### Quality Checks
- All core docs are current
- CHANGELOG reflects recent changes
- Templates are being used correctly
- Documentation builds successfully

## Best Practices

1. Keep It Current
   - Update docs with code changes
   - Regular review cycles
   - Remove outdated content

2. Be Consistent
   - Follow templates
   - Use established terminology
   - Maintain style guide

3. Think of the Reader
   - Clear, concise writing
   - Logical organization
   - Good examples

4. Version Control
   - Meaningful commit messages
   - Document significant changes
   - Keep change history

## Support

For questions about:
- Documentation structure: See development-process/templates
- Content guidelines: Check development-process/examples
- Technical details: Reference docs/core/ARCHITECTURE.md
- Process questions: Review this guide