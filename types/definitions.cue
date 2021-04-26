#Contract: {
	slug:        string
	handle:      string
	type:        string
	loop:        string
	description: *"" | string
	version:     #Semver
	data: {...}
	requires: [...]
	provides: [...]
}

#Semver: string
