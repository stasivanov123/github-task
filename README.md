# GitHub test task

- Monorepo with Nx
- See PAT section for instructions for GitHub token
- Run with `nx run backend:serve:development` and `nx run frontend:dev`
- Swagger at http://localhost:3001/api/#/

## PAT

A token needs to be created at https://github.com/settings/tokens?type=beta with " Read and Write access to starring"  
Put token into GITHUB_TOKEN variable in `backend/.env`

## Notes

- Starring public repos with a GitHub Personal Access Token does not seem to be supported. Please test on private repos: http://localhost:3000/?q=is%3Aprivate
- Suggestion to load star status from the frontend

## Time

- Basic bootstrap ~15m
- Basic backend ~25m
- Debugging issue with starring public repos ~1h
- Basic frontend ~1.5h
- Star/unstar ~30m
