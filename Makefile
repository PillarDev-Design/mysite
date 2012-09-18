mongo:
	@mongoimport -d mysite -c notes deploy/notes.json
