
# Cyberoo (Next.js + Tailwind + Typscript)

Hackathon: Schelling Point Virtual Hackathon
Task 1 - Social Connection Explorer

 Feature description 
 - Find and labelling connections between ethereum address and display them in a network graph
  

## Demo
Website - https://cyberoo.vercel.app

Video demo - https://streamable.com/vgfd6z


## RESTful URLs

### General guidelines for RESTful URLs
* GET only for now
* Replace `:address` with proper address to get a list of connection from different provider


### Core Api

>  `https://cyberoo.vercel.app/api/core/:address`


Return profile data, including a random list of connections sourced from Transfer(Etherscan), Cyber Connect, Open Sea

 #### Transfer

>  `https://cyberoo.vercel.app/api/transfer/:address`

 Return a list of connection from etherscan
 **Example response:**

    [
	 {
	 	"sourceAddress": '0xabc123',
	    "address": "0x7be8076f4ea4a4ad08075c2508e481d6c946d12b",
	    "link": "https://etherscan.io/tx/0xaca5cb06b5eff76377e2dd9ac6a9f4c472326e659b0de8fab84b5db43ba6f587",
	    "type": {
	      "description": "sent",
	      "label": "Transfer"
	     }
	  }
    ]
 
 #### Cyber Connection
`https://cyberoo.vercel.app/api/cyber_connect/:address`
 Return a list of connection from CyberConnect
**Example response:**

    [
	 {
	 	"sourceAddress": '0xabc123',
	    "address": "0x7be8076f4ea4a4ad08075c2508e481d6c946d12b",
	    "link": "https://app.cyberconnect.me/address/0x000d7977241428a373e3760cdc05fa3ed08c111a",
	    "type": {
	      "description": "following",
	      "label": "CyberConnect"
	     }
	  }
    ]
 
 #### OpenSea
`https://cyberoo.vercel.app/api/opensea/:address`

  Return a list of connection from Open sea



## How to run

Deploy locally 
```bash
npm run dev
```
Build
```bash
npm run build
```
Test
```bash
npm run test
```

## TODO:

1. Finish network graph for displaying connections and fix click issue 
2. Add unit test to cover transform data logic
