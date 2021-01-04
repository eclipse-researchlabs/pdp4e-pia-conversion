<!--- *******************************************************************************
      * Copyright (C) 2021 TRIALOG
      * 
      * This program and the accompanying materials are made
      * available under the terms of the Eclipse Public License 2.0
      * which is available at https://www.eclipse.org/legal/epl-2.0/
      * 
      * SPDX-License-Identifier: EPL-2.0
      ******************************************************************************* --->
## Endpoints:

`GET /pias` Return the data of all pias

`GET /pias/{id}` Return the data of a specific pia

`GET /pias/{id}/measures`
`GET /pias/{id}/measures/{id}`

`POST /pias/{id}/measures/` Add a measure
Post request body: a JSON object containing a title and content key:
```
{
	title: "My measure",
	content: "description of the measure"
}
```

JSON data format for measure:
```
{
	id: (auto)
	pia_id: (auto)
	title:
	content:
	placeholder:
}
```

`GET /pias/{id}/answers`
`GET /pias/{id}/answers/{id}`

`POST /pias/{id}/answers/` Add a measure


JSON data format for likelihood and severity answer:
```
{
	id: (auto)
	pia_id: (auto)
	reference_to:
	data:{
		gauge:
	}
	created_at: (auto)
	updated_at: (auto)
}
```

JSON data format for impact, threats, sources, initial measures answer:
```
{
	id: (auto)
	pia_id: (auto)
	reference_to:
	data:{
		list: []
	}
	created_at: (auto)
	updated_at: (auto)
}
```

Reference to: 3 concatenated digits representing: section, item, question
example: Section 1, Item 2, Question 3 => reference_to: '123'
cf https://github.com/LINCnil/pia/blob/master/src/assets/files/pia_architecture.json
