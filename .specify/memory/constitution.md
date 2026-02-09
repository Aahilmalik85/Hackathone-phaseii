<!--
Sync Impact Report - Constitution v1.0.0
========================================
Version Change: Initial → 1.0.0
Ratification Date: 2026-01-08
Last Amended: 2026-01-08

Changes:
- Initial constitution created with 14 non-negotiable rules
- Added 6 core principles covering technology stack, security, and architecture
- Defined development workflow requirements
- Established governance rules

Principles Added:
- I. Technology Stack (Backend, Database, ORM, Auth, Frontend)
- II. Security & Authentication
- III. Architecture & Structure
- IV. Development Workflow
- V. Configuration Management
- VI. Specification Compliance

Templates Status:
✅ spec-template.md - Reviewed, compatible with constitution requirements
✅ plan-template.md - Reviewed, constitution check section aligns
✅ tasks-template.md - Reviewed, task structure supports principles
⚠ Commands - May need updates to enforce constitution checks

Follow-up TODOs:
- None - all placeholders filled
-->

# Hackathon Todo – Phase II (Full-Stack) Constitution

## Core Principles

### I. Technology Stack (NON-NEGOTIABLE)

**Backend Requirements:**
- Backend MUST be implemented in Python using FastAPI
- Backend server MUST run on port 8001 only
- No alternative frameworks or ports are permitted

**Database Requirements:**
- Database MUST be Neon Serverless PostgreSQL
- Database connection MUST use the provided Neon connection string ONLY
- ORM MUST be SQLModel
- No alternative databases or ORMs are permitted

**Frontend Requirements:**
- Frontend MUST be Next.js 16+ using App Router
- No alternative frontend frameworks are permitted

**Rationale**: These technology choices are fixed requirements for Phase II of the hackathon. Consistency across the stack ensures predictable behavior, simplified debugging, and adherence to competition constraints.

### II. Security & Authentication (NON-NEGOTIABLE)

**Authentication:**
- Authentication MUST be passwordless and JWT-based using Better Auth
- REST API MUST be secured using JWT Bearer tokens
- No alternative authentication systems are permitted

**Authorization:**
- All API routes MUST enforce user ownership on every operation
- Every data access operation MUST verify the requesting user owns or has permission to access the resource
- No operation may bypass ownership checks

**Credential Management:**
- No hardcoded credentials are allowed outside environment variables
- All secrets MUST be stored in `.env` files (never committed)
- Connection strings, API keys, and tokens MUST use environment variables

**Rationale**: Security is non-negotiable. Passwordless JWT auth provides modern security without password management overhead. User ownership enforcement prevents unauthorized data access. Environment variables prevent credential leaks.

### III. Architecture & Structure (NON-NEGOTIABLE)

**Monorepo Structure:**
- The application MUST be structured as a monorepo compatible with Spec-Kit Plus
- Project structure MUST follow Spec-Kit Plus conventions
- Backend and frontend MUST be organized as separate modules within the monorepo

**Specification Authority:**
- Specs located in `/specs` are the source of truth for all features
- All implementation decisions MUST align with specifications
- Deviations from specs require explicit documentation and approval

**Rationale**: Monorepo structure enables coordinated development across frontend and backend. Spec-driven development ensures implementation matches requirements and provides traceability.

### IV. Development Workflow (NON-NEGOTIABLE)

**Specification-First Development:**
- Claude Code MUST read relevant specs before modifying any code
- No code changes may be made without understanding the specification context
- Implementation MUST reference specific requirements from specs

**Change Discipline:**
- All changes MUST be small, testable, and traceable to specifications
- Code references MUST use the pattern `file_path:line_number` for precision
- Commits MUST reference the feature specification or task being implemented

**Rationale**: Reading specs first prevents misalignment and rework. Small, testable changes reduce risk and enable incremental validation. Precise references enable code review and debugging.

### V. Configuration Management

**Environment Configuration:**
- All environment-specific configuration MUST use environment variables
- Configuration MUST support multiple environments (development, staging, production)
- Default values MUST be safe for development (never production credentials)

**Port Configuration:**
- Backend MUST use port 8001 (non-configurable)
- Frontend port may be configurable but MUST default to standard Next.js port (3000)

**Rationale**: Environment variables enable deployment flexibility without code changes. Fixed backend port ensures consistency with hackathon requirements.

### VI. Specification Compliance

**Mandatory Compliance:**
- Every feature implementation MUST have a corresponding specification in `/specs`
- Specifications MUST include user stories, requirements, and success criteria
- Implementation MUST be validated against specification acceptance criteria

**Traceability:**
- Every code change MUST be traceable to a specification requirement
- Task lists MUST reference specific user stories from specifications
- Architectural decisions MUST be documented in ADRs when significant

**Rationale**: Specification compliance ensures the system meets requirements. Traceability enables impact analysis and requirement validation.

## Development Workflow

**Pre-Implementation Requirements:**
1. Read the feature specification from `/specs/[feature-name]/spec.md`
2. Review the implementation plan from `/specs/[feature-name]/plan.md`
3. Understand the task context from `/specs/[feature-name]/tasks.md`
4. Verify the change aligns with constitution principles

**Implementation Requirements:**
1. Make the smallest viable change to satisfy the requirement
2. Enforce user ownership checks on all data operations
3. Use environment variables for all configuration
4. Test the change against specification acceptance criteria
5. Document any architectural decisions in ADRs

**Post-Implementation Requirements:**
1. Verify no hardcoded credentials were introduced
2. Confirm all API routes enforce user ownership
3. Validate against specification success criteria
4. Create or update Prompt History Records (PHRs)

## Technology Constraints

**Prohibited Alternatives:**
- ❌ No alternative backend frameworks (only FastAPI)
- ❌ No alternative databases (only Neon PostgreSQL)
- ❌ No alternative ORMs (only SQLModel)
- ❌ No alternative authentication systems (only Better Auth)
- ❌ No alternative frontend frameworks (only Next.js 16+)
- ❌ No alternative ports for backend (only 8001)

**Failure to follow any constraint is considered an invalid implementation.**

## Governance

**Constitution Authority:**
- This constitution supersedes all other development practices
- All code reviews MUST verify compliance with constitution principles
- Any deviation from non-negotiable rules MUST be rejected

**Amendment Process:**
- Amendments require explicit documentation of rationale
- Version number MUST be incremented according to semantic versioning:
  - MAJOR: Backward incompatible changes to non-negotiable rules
  - MINOR: New principles added or material expansions
  - PATCH: Clarifications, wording improvements, non-semantic refinements
- Amendments MUST include migration plan for existing code

**Compliance Review:**
- Every feature specification MUST include a constitution check
- Every implementation plan MUST verify alignment with principles
- Every pull request MUST confirm no constitution violations

**Complexity Justification:**
- Any complexity beyond constitution requirements MUST be justified
- Simpler alternatives MUST be documented and explained why rejected
- Unjustified complexity MUST be removed

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
