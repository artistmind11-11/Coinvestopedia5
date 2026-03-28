Your API key will be injected into requests to https://pro-api.llama.fi endpoints.
When your API key is set, free endpoints will be changed to pro version to bypass rate limits"


Open SearchSearch
Keyboard Shortcut:CTRL⌃ k
































































Open API Client
Powered by Scalar

v1.0.0-oas3
OAS 3.1.1
DefiLlama API

Download OpenAPI Document

Download OpenAPI Document
Need higher rate limits or priority support? We offer a premium plan for 300$/mo. To get it, go to https://defillama.com/subscription

SDK
JavaScript — npm install @defillama/api — GitHub

Python — pip install defillama-sdk — GitHub

Quick start (JavaScript):

import { DefiLlama } from '@defillama/api'

const client = new DefiLlama()
const protocols = await client.tvl.getProtocols()
Quick start (Python):

from defillama_sdk import DefiLlama

client = DefiLlama()
protocols = client.tvl.getProtocols()
Coding with AI? Paste this link to LLM-specific docs for best results llms.txt

Server
Server:
https://api.llama.fi
Client Libraries

Curl
Curl Shell
TVL ​#Copy link
Retrieve TVL data

TVLOperations
get
/protocols
get
/protocol/{protocol}
get
/v2/historicalChainTvl
get
/v2/historicalChainTvl/{chain}
get
/tvl/{protocol}
get
/v2/chains
get
/api/tokenProtocols/{symbol}
API Plan
get
/api/inflows/{protocol}/{timestamp}
API Plan
get
/api/chainAssets
API Plan
List all protocols on defillama along with their tvl​#Copy link
Responses

200
Array of all protocols with their TVL data

application/json
Request Example forget/protocols

JavaScript SDK
Copy content
const result = await client.tvl.getProtocols()

Test Request
(get /protocols)
Status:200
Copy content
[
  {
    "id": "2269",
    "name": "Aave",
    "symbol": "AAVE",
    "category": "Lending",
    "chains": [
      "Ethereum",
      "Polygon"
    ],
    "tvl": 5200000000,
    "chainTvls": {
      "Ethereum": 3200000000,
      "Polygon": 2000000000
    },
    "change_1d": 2.1,
    "change_7d": -5.3
  }
]
Array of all protocols with their TVL data

Get historical TVL of a protocol and breakdowns by token and chain​#Copy link
Path Parameters
protocol
Type:string
required
Example
protocol slug

Responses

200
Protocol details with historical TVL data and chain breakdowns

application/json
404
Protocol not found

Request Example forget/protocol/{protocol}

JavaScript SDK
Copy content
const result = await client.tvl.getProtocol('<protocol>')

Test Request
(get /protocol/{protocol})
Status:200
Status:404
Copy content
{
  "id": "parent#aave",
  "name": "AAVE",
  "symbol": "AAVE",
  "category": "Lending",
  "chains": [
    "Ethereum",
    "Polygon",
    "Avalanche"
  ],
  "currentChainTvls": {
    "Ethereum": 3200000000,
    "Polygon": 1500000000
  },
  "chainTvls": {
    "propertyName*": {
      "tvl": [
        {
          "date": 1609459200,
          "totalLiquidityUSD": 1000000
        }
      ],
      "tokens": [
        {
          "date": 1609459200,
          "tokens": {
            "USDC": 1000000,
            "USDT": 800000
          }
        }
      ]
    }
  }
}
Protocol details with historical TVL data and chain breakdowns

Get historical TVL (excludes liquid staking and double counted tvl) of DeFi on all chains​#Copy link
Responses

200
Historical TVL data for all chains combined

application/json
Request Example forget/v2/historicalChainTvl

JavaScript SDK
Copy content
const result = await client.tvl.getHistoricalChainTvl()

Test Request
(get /v2/historicalChainTvl)
Status:200
Copy content
[
  {
    "date": 1609459200,
    "tvl": 15000000000
  }
]
Historical TVL data for all chains combined

Get historical TVL (excludes liquid staking and double counted tvl) of a chain​#Copy link
Path Parameters
chain
Type:string
required
Example
chain slug, you can get these from /chains or the chains property on /protocols

Responses

200
Historical TVL data for the specified chain

application/json
404
Chain not found

Request Example forget/v2/historicalChainTvl/{chain}

JavaScript SDK
Copy content
const result = await client.tvl.getHistoricalChainTvl('<chain>')

Test Request
(get /v2/historicalChainTvl/{chain})
Status:200
Status:404
Copy content
[
  {
    "date": 1609459200,
    "tvl": 45000000000
  }
]
Historical TVL data for the specified chain

Simplified endpoint to get current TVL of a protocol​#Copy link
Simplified endpoint that only returns a number, the current TVL of a protocol

Path Parameters
protocol
Type:string
required
Example
protocol slug

Responses

200
Current TVL of the protocol in USD

application/json
404
Protocol not found

Request Example forget/tvl/{protocol}

JavaScript SDK
Copy content
const result = await client.tvl.getTvl('<protocol>')

Test Request
(get /tvl/{protocol})
Status:200
Status:404
Copy content
4962012809.795062
Current TVL of the protocol in USD

Get current TVL of all chains​#Copy link
Responses

200
Array of all chains with their TVL data

application/json
Request Example forget/v2/chains

JavaScript SDK
Copy content
const result = await client.tvl.getChains()

Test Request
(get /v2/chains)
Status:200
Copy content
[
  {
    "gecko_id": "ethereum",
    "tvl": 65998652431.40251,
    "tokenSymbol": "ETH",
    "cmcId": "1027",
    "name": "Ethereum",
    "chainId": 1
  }
]
Array of all chains with their TVL data

API Plan
Lists the amount of a certain token within all protocols. Data for the Token Usage page​#Copy link
Path Parameters
symbol
Type:string
required
Example
token slug

Responses

200
successful operation

application/json
Request Example forget/api/tokenProtocols/{symbol}

JavaScript SDK
Copy content
const result = await proClient.tvl.getTokenProtocols('<symbol>')

Test Request
(get /api/tokenProtocols/{symbol})
Status:200
Copy content
[
  {
    "name": "Portal",
    "category": "Bridge",
    "amountUsd": {
      "coingecko:tether-avalanche-bridged-usdt-e": 6485.2310529788765,
      "coingecko:xcusdt": 45.514624238131,
      "coingecko:layerzero-bridged-usdt-aptos": 7312.740629193999
    }
  }
]
successful operation

API Plan
Lists the amount of inflows and outflows for a protocol at a given date​#Copy link
Path Parameters
protocol
Type:string
required
Example
protocol slug

timestamp
Type:integer
required
Example
unix timestamp

Responses

200
successful operation

application/json
Request Example forget/api/inflows/{protocol}/{timestamp}

JavaScript SDK
Copy content
const result = await proClient.tvl.getInflows('<protocol>', 1704067200, 1704153600)

Test Request
(get /api/inflows/{protocol}/{timestamp})
Status:200
Copy content
{
  "outflows": -160563462.23474675,
  "oldTokens": {
    "date": 1700005031,
    "tvl": {
      "POLYGONUSDC": 2800590.050521,
      "STMATIC": 5910852.971103674,
      "USDC.E": 213182.234023,
      "WETH": 138751.92261049704,
      "WSTETH": 21205.858768287606,
      "COMP": 899912.2484411557,
      "ARB": 5191395.55706979,
      "UNI": 3276947.8126982865,
      "WBTC": 15237.12702489,
      "WMATIC": 4316699.376111328,
      "USDBC": 1567657.999816,
      "GMX": 44027.42587184711,
      "CBETH": 10011.824096757742,
      "LINK": 2915041.329272804,
      "USDC": 27302168.767972,
      "MATICX": 5999572.681088426
    }
  },
  "currentTokens": {
    "date": 1752771743,
    "tvl": {
      "SKY": 1839111.3665808514,
      "WSUPEROETHB": 610.1258731272615,
      "RETH": 335.9162918778323,
      "WEETH": 21264.320107593303,
      "STMATIC": 43248.612454883136,
      "TETH": 7537.467077317422,
      "USDT": 23936602.852221,
      "USDC.E": 457484.93217,
      "USDS": 986286.7461886762,
      "FBTC": 7.88084468,
      "WUSDM": 9912.583708525639,
      "COMP": 199962.19982196926,
      "UNI": 748399.6623864435,
      "WRON": 48676.91287257022,
      "WBTC": 8346.44481716,
      "EZETH": 9378.908917279387,
      "SDEUSD": 4476349.521512799,
      "OSETH": 1751.011747340086,
      "USDT0": 4807642.14842,
      "LINK": 629790.4518594383,
      "DEUSD": 14779291.40757071,
      "MATICX": 239292.60540364735,
      "ETHX": 7.643953648e-9,
      "POLYGONUSDC": 1130561.097829,
      "OP": 474055.27558234957,
      "RSWETH": 0.7588296185577288,
      "SFRAX": 32550977.989188965,
      "METH": 1256.0286269578846,
      "WETH": 106772.79955793211,
      "WSTETH": 127030.77547884149,
      "ARB": 8082828.497277849,
      "RSETH": 13198.88264941232,
      "WMATIC": 1192273.6401273129,
      "GMX": 6408.6736121308695,
      "USDBC": 200217.562935,
      "CBETH": 2094.7317932368333,
      "USDE": 1660443.2086449957,
      "ETH": 657.5898609775202,
      "SUSDS": 2360827.122683512,
      "USDC": 67152880.13345899,
      "TBTC": 297.109236856541,
      "AXS": 156.95240126041227,
      "CBBTC": 722.70428829,
      "WRSETH": 208.78735872239974,
      "AERO": 3582072.5610455093
    }
  }
}
successful operation

API Plan
Get assets of all chains​#Copy link
Responses

200
successful operation

application/json
Request Example forget/api/chainAssets

JavaScript SDK
Copy content
const result = await proClient.tvl.getChainAssets()

Test Request
(get /api/chainAssets)
Status:200
Copy content
{
  "chain": {
    "canonical": {
      "total": "4482065428.82707789718257509123",
      "breakdown": {
        "AGLD": "8.25709",
        "STPT": "263726.9847408758",
        "APU": "43899.14483171882",
        "CTX": "595333.6768847435",
        "APW": "37727.892544515686"
      }
    },
    "native": {
      "total": "10848868127.0093572327157505031494340578574406321858",
      "breakdown": {
        "BENI": "1322294.3731837485",
        "ANIME": "10.7583162713828217314035397949084",
        "SACA": "114132.47631920826",
        "HOKK": "4966.3804669563400723148947324498025",
        "TOSHI": "91927630.6839119443580116994151258714"
      }
    },
    "thirdParty": {
      "total": "3182802062.49398527398560408906",
      "breakdown": {
        "BRZ": "1810685.01887618296911",
        "BOBA": "0",
        "BURN": "0",
        "GGTK": "0.6545695",
        "GYFI": "2618437.7978"
      }
    },
    "total": {
      "total": "18513735618.330420403",
      "breakdown": {
        "AGLD": "8.25709",
        "STPT": "263726.9847408758",
        "APU": "43899.14483171882",
        "CTX": "595333.6768847435",
        "APW": "37727.892544515686"
      }
    }
  },
  "timestamp": 1752843956
}
successful operation

coins (Collapsed)​#Copy link
General blockchain data used by defillama and open-sourced

coinsOperations
get
/prices/current/{coins}
get
/prices/historical/{timestamp}/{coins}
get
/batchHistorical
get
/chart/{coins}
get
/percentage/{coins}
get
/prices/first/{coins}
get
/block/{chain}/{timestamp}
Show More
stablecoins (Collapsed)​#Copy link
Data from our stablecoins dashboard

stablecoinsOperations
get
/stablecoins
get
/stablecoincharts/all
get
/stablecoincharts/{chain}
get
/stablecoin/{asset}
get
/stablecoinchains
get
/stablecoinprices
get
/stablecoins/stablecoindominance/{chain}
API Plan
Show More
yields (Collapsed)​#Copy link
Data from our yields/APY dashboard

yieldsOperations
get
/pools
get
/chart/{pool}
get
/yields/poolsOld
API Plan
get
/yields/poolsBorrow
API Plan
get
/yields/chartLendBorrow/{pool}
API Plan
get
/yields/perps
API Plan
get
/yields/lsdRates
API Plan
Show More
volumes (Collapsed)​#Copy link
Data from our volumes dashboards

volumesOperations
get
/overview/dexs
get
/overview/dexs/{chain}
get
/summary/dexs/{protocol}
get
/overview/options
get
/overview/options/{chain}
get
/summary/options/{protocol}
Show More
fees and revenue (Collapsed)​#Copy link
Data from our fees and revenue dashboard

fees and revenueOperations
get
/overview/fees
get
/overview/fees/{chain}
get
/summary/fees/{protocol}
Show More
perps (Collapsed)​#Copy link
perpsOperations
get
/overview/open-interest
get
/api/overview/derivatives
API Plan
get
/api/summary/derivatives/{protocol}
API Plan
Show More
Unlocks (Collapsed)​#Copy link
UnlocksOperations
get
/api/emissions
API Plan
get
/api/emission/{protocol}
API Plan
Show More
main page (Collapsed)​#Copy link
main pageOperations
get
/api/categories
API Plan
get
/api/forks
API Plan
get
/api/oracles
API Plan
get
/api/hacks
API Plan
get
/api/raises
API Plan
get
/api/treasuries
API Plan
get
/api/entities
API Plan
Show More
token liquidity (Collapsed)​#Copy link
token liquidityOperations
get
/api/historicalLiquidity/{token}
API Plan
Show More
ETFs (Collapsed)​#Copy link
ETFsOperations
get
/etfs/snapshot
API Plan
get
/etfs/flows
API Plan
Show More
narratives (Collapsed)​#Copy link
narrativesOperations
get
/fdv/performance/{period}
API Plan
Show More
bridges (Collapsed)​#Copy link
bridgesOperations
get
/bridges/bridges
API Plan
get
/bridges/bridge/{id}
API Plan
get
/bridges/bridgevolume/{chain}
API Plan
get
/bridges/bridgedaystats/{timestamp}/{chain}
API Plan
get
/bridges/transactions/{id}
API Plan
Show More
meta (Collapsed)​#Copy link
metaOperations
get
/usage/APIKEY
API Plan
Show More
DAT (Collapsed)​#Copy link
DATOperations
get
/dat/institutions
API Plan
get
/dat/institutions/{symbol}
API Plan
Show More
Equities ​#Copy link
EquitiesOperations
get
/equities/v1/companies
API Plan
get
/equities/v1/statements
API Plan
get
/equities/v1/price-history
API Plan
get
/equities/v1/ohlcv
API Plan
get
/equities/v1/summary
API Plan
get
/equities/v1/filings
API Plan
betaAPI Plan
Get list of all tracked public companies​#Copy link
Returns a list of all publicly traded companies tracked by DefiLlama, with current market summary data for each, sorted by market capitalization (largest first)

Responses

200
Successful operation

application/json
401
Unauthorized

404
Companies with summary not found

500
Internal server error

Request Example forget/equities/v1/companies

Shell Curl
Copy content
curl 'https://pro-api.llama.fi/<API-KEY>/equities/v1/companies'

Test Request
(get /equities/v1/companies)
Status:200
Status:401
Status:404
Status:500
Copy content
[
  {
    "ticker": "NVDA",
    "name": "NVIDIA Corporation",
    "currentPrice": 172.7,
    "volume": 209815684,
    "marketCap": 4197473583104,
    "priceChangePercentage1d": -3.28,
    "trailingPE": 35.24,
    "dividendYield": 0.0224,
    "priceToBook": 26.68,
    "lastUpdatedAt": "2026-03-21T13:33:10Z",
    "priceChangePercentage7d": -5.74,
    "priceChangePercentage1m": -8.08,
    "revenueTTM": 215938000000,
    "grossProfitTTM": 153463000000,
    "totalAssets": 206803000000,
    "earningsTTM": 120067000000,
    "operatingProfitMargin": 60.38,
    "totalLiabilities": 49510000000
  }
]
Successful operation

betaAPI Plan
Get financial statements for a company​#Copy link
Returns income statement, balance sheet, and cash flow statement for the given ticker, broken down by quarterly and annual periods.

Query Parameters
ticker
Type:string
required
Example
Stock ticker symbol (case-insensitive)

Responses

200
Successful operation

application/json
400
Missing required ticker parameter

401
Unauthorized

404
Ticker not found

500
Internal server error

Request Example forget/equities/v1/statements

Shell Curl
Copy content
curl 'https://pro-api.llama.fi/<API-KEY>/equities/v1/statements'

Test Request
(get /equities/v1/statements)
Status:200
Status:400
Status:401
Status:404
Status:500
Copy content
{
  "incomeStatement": {
    "labels": [
      "Total Revenue",
      "Cost of Revenue",
      "Gross Profit",
      "Operating Expense",
      "Operating Income",
      "Non-operating Items",
      "Income Before Tax",
      "Net Income"
    ],
    "children": {
      "quarterly": {
        "Total Revenue": {
          "labels": [
            "Bank Servicing and Subscription and Circulation",
            "Remaining Items"
          ]
        },
        "Operating Expense": {
          "labels": [
            "General and Administrative Expense",
            "Research and Development Expense",
            "Selling and Marketing Expense",
            "Other Operating Income (Expense), Net",
            "Remaining Items"
          ]
        },
        "Non-operating Items": {
          "labels": [
            "Other Nonoperating Income (Expense)",
            "Remaining Items"
          ]
        }
      },
      "annual": {
        "Total Revenue": {
          "labels": [
            "Bank Servicing and Subscription and Circulation",
            "Remaining Items"
          ]
        },
        "Operating Expense": {
          "labels": [
            "General and Administrative Expense",
            "Research and Development Expense",
            "Selling and Marketing Expense",
            "Other Operating Income (Expense), Net",
            "Remaining Items"
          ]
        },
        "Non-operating Items": {
          "labels": [
            "Other Nonoperating Income (Expense)",
            "Remaining Items"
          ]
        }
      }
    },
    "quarterly": {
      "periods": [
        "Q1-2024",
        "Q2-2024",
        "Q3-2024",
        "Q4-2024"
      ],
      "periodEnding": [
        "2024-03-31",
        "2024-06-30",
        "2024-09-30",
        "2024-12-31"
      ],
      "values": [
        [
          1801112000,
          2227962000,
          1311908000,
          2498462000
        ],
        [
          234066000,
          335426000,
          197251000,
          501181000
        ],
        [
          1567046000,
          1892536000,
          1114657000,
          1997281000
        ],
        [
          579333000,
          1017811000,
          822849000,
          null
        ],
        [
          987713000,
          874725000,
          291808000,
          922324000
        ],
        [
          8953000,
          -5844000,
          -20948000,
          -31784000
        ],
        [
          996666000,
          868881000,
          270860000,
          890540000
        ],
        [
          771463000,
          1606349000,
          406100000,
          840208000
        ]
      ],
      "children": {
        "Total Revenue": {
          "values": [
            [
              1596981000,
              2033011000,
              1234736000,
              2490025000
            ],
            [
              204131000,
              194951000,
              77172000,
              8437000
            ]
          ]
        },
        "Operating Expense": {
          "values": [
            [
              121231000,
              248195000,
              242642000,
              297324000
            ],
            [
              184225000,
              291461000,
              356264000,
              459611000
            ],
            [
              117990000,
              195733000,
              105395000,
              244571000
            ],
            [
              null,
              282422000,
              118548000,
              258627000
            ],
            [
              155887000,
              73451000,
              144489000,
              -1035000
            ]
          ]
        },
        "Non-operating Items": {
          "values": [
            [
              8953000,
              -5844000,
              -20948000,
              -31784000
            ],
            [
              987713000,
              868881000,
              270860000,
              890540000
            ]
          ]
        }
      }
    },
    "annual": {
      "periods": [
        "FY-2023",
        "FY-2024"
      ],
      "periodEnding": [
        "2023-12-31",
        "2024-12-31"
      ],
      "values": [
        [
          1166436000,
          2271637000
        ],
        [
          277826000,
          317042000
        ],
        [
          888610000,
          1954595000
        ],
        [
          1443073000,
          920526000
        ],
        [
          -554463000,
          1034069000
        ],
        [
          -54982000,
          462807000
        ],
        [
          -609445000,
          1496876000
        ],
        [
          -429659000,
          1291176000
        ]
      ],
      "children": {
        "Total Revenue": {
          "values": [
            [
              1164891000,
              2197030000
            ],
            [
              1545000,
              74607000
            ]
          ]
        },
        "Operating Expense": {
          "values": [
            [
              413578000,
              362519000
            ],
            [
              570664000,
              368691000
            ],
            [
              200204000,
              225827000
            ],
            [
              258627000,
              -20270000
            ],
            [
              42453000,
              -16241000
            ]
          ]
        },
        "Non-operating Items": {
          "values": [
            [
              -54982000,
              462807000
            ],
            [
              -609445000,
              1496876000
            ]
          ]
        }
      }
    }
  },
  "balanceSheet": {
    "labels": [
      "Total Current Assets",
      "Total Non-Current Assets",
      "Total Assets",
      "Total Current Liabilities",
      "Total Liabilities",
      "Total Stockholders Equity",
      "Total Liabilities and Equity"
    ],
    "children": {
      "quarterly": {},
      "annual": {}
    },
    "quarterly": {
      "periods": [
        "Q1-2024",
        "Q2-2024",
        "Q3-2024",
        "Q4-2024"
      ],
      "periodEnding": [
        "2024-03-31",
        "2024-06-30",
        "2024-09-30",
        "2024-12-31"
      ],
      "values": [
        [
          79373000,
          204728000,
          209604000,
          215571000
        ],
        [
          126996000,
          248147000,
          250536000,
          254181000
        ],
        [
          206369000,
          452875000,
          460140000,
          469752000
        ],
        [
          217472000,
          221034000,
          223916000,
          226930000
        ],
        [
          217472000,
          221034000,
          223916000,
          226930000
        ],
        [
          231489000,
          234641000,
          237270000,
          314164000
        ],
        [
          448961000,
          455675000,
          457186000,
          541094000
        ]
      ],
      "children": {}
    },
    "annual": {
      "periods": [
        "FY-2023",
        "FY-2024"
      ],
      "periodEnding": [
        "2023-12-31",
        "2024-12-31"
      ],
      "values": [
        [
          217472000,
          226930000
        ],
        [
          217472000,
          226930000
        ],
        [
          434944000,
          453860000
        ],
        [
          221034000,
          226930000
        ],
        [
          221034000,
          226930000
        ],
        [
          234641000,
          314164000
        ],
        [
          455675000,
          541094000
        ]
      ],
      "children": {}
    }
  },
  "cashflow": {
    "labels": [
      "Cashflow From Operating Activities",
      "Cashflow From Investing Activities",
      "Cashflow From Financing Activities",
      "Net Cashflow"
    ],
    "children": {
      "quarterly": {},
      "annual": {}
    },
    "quarterly": {
      "periods": [
        "Q1-2024",
        "Q2-2024",
        "Q3-2024",
        "Q4-2024"
      ],
      "periodEnding": [
        "2024-03-31",
        "2024-06-30",
        "2024-09-30",
        "2024-12-31"
      ],
      "values": [
        [
          234066000,
          335426000,
          197251000,
          501181000
        ],
        [
          -121231000,
          -248195000,
          -242642000,
          -297324000
        ],
        [
          -98771300,
          -87472500,
          -29180800,
          -92232400
        ],
        [
          14221670,
          13119700,
          -7440700,
          111211600
        ]
      ],
      "children": {}
    },
    "annual": {
      "periods": [
        "FY-2023",
        "FY-2024"
      ],
      "periodEnding": [
        "2023-12-31",
        "2024-12-31"
      ],
      "values": [
        [
          277826000,
          317042000
        ],
        [
          -413578000,
          -362519000
        ],
        [
          -55446300,
          103406900
        ],
        [
          -19123600,
          45811400
        ]
      ],
      "children": {}
    }
  }
}

default
betaAPI Plan
Get historical price data for a company​#Copy link
Returns daily closing prices as two-element arrays: ISO 8601 date-time string, then numeric price. Sorted by date descending (newest first).

Query Parameters
ticker
Type:string
required
Example
Stock ticker symbol (case-insensitive)

timeframe
Type:string
enum
default:  
"MAX"
Example
Optional lookback window (case-insensitive). Omit or empty for full history (MAX).

1W
1M
6M
1Y
5Y
MAX
Responses

200
Successful operation

application/json

400
Missing required ticker or invalid timeframe

application/json
401
Unauthorized

404
Prices not found for ticker

500
Internal server error

Request Example forget/equities/v1/price-history

Shell Curl
Copy content
curl 'https://pro-api.llama.fi/<API-KEY>/equities/v1/price-history'

Test Request
(get /equities/v1/price-history)
Status:200
Status:400
Status:401
Status:404
Status:500
Copy content
[
  [
    "2026-03-21T13:33:10Z",
    197.5
  ],
  [
    "2026-03-20T00:00:00Z",
    196.2
  ]
]
Successful operation

betaAPI Plan
Get OHLCV candle data for a company​#Copy link
Returns daily OHLCV bars as six-number arrays: Unix timestamp in seconds (UTC), open, high, low, close, volume. Sorted by time descending (newest first). Optional timeframe filters how far back data goes; omit or empty for full history (MAX).

Query Parameters
ticker
Type:string
required
Example
Stock ticker symbol (case-insensitive)

timeframe
Type:string
enum
default:  
"MAX"
Example
Optional lookback window (case-insensitive). Same values as price history. Omit or empty for full history (MAX).

1W
1M
6M
1Y
5Y
MAX
Responses

200
Successful operation

application/json

400
Missing required ticker or invalid timeframe

application/json
401
Unauthorized

404
OHLCV not found for ticker

500
Internal server error

Request Example forget/equities/v1/ohlcv

Shell Curl
Copy content
curl 'https://pro-api.llama.fi/<API-KEY>/equities/v1/ohlcv'

Test Request
(get /equities/v1/ohlcv)
Status:200
Status:400
Status:401
Status:404
Status:500
Copy content
[
  [
    1773964800,
    247.98,
    249.2,
    246,
    247.99,
    88268000
  ],
  [
    1773878400,
    249.4,
    251.83,
    247.3,
    248.96,
    34864100
  ]
]
Successful operation

betaAPI Plan
Get live market summary for a company​#Copy link
Returns current market data for a single ticker. This is a compact snapshot (no ticker / name fields); use GET /equities/v1/companies for the list shape that includes company identity and balance-sheet highlights.

Query Parameters
ticker
Type:string
required
Example
Stock ticker symbol (case-insensitive)

Responses

200
Successful operation

application/json
400
Missing required ticker parameter

401
Unauthorized

404
Summary not found for ticker

500
Internal server error

Request Example forget/equities/v1/summary

Shell Curl
Copy content
curl 'https://pro-api.llama.fi/<API-KEY>/equities/v1/summary'

Test Request
(get /equities/v1/summary)
Status:200
Status:400
Status:401
Status:404
Status:500
Copy content
{
  "currentPrice": 247.99,
  "volume": 87981315,
  "marketCap": 3644938780672,
  "fiftyTwoWeekHigh": 288.62,
  "fiftyTwoWeekLow": 169.21,
  "dividendYield": 0.4137,
  "trailingPE": 31.35,
  "priceChangePercentage1d": -0.39,
  "priceToBook": 41.35,
  "updatedAt": "2026-03-21T07:31:15Z",
  "priceChangePercentage7d": -1.91,
  "priceChangePercentage1m": -4.83,
  "revenueTTM": 435617000000,
  "grossProfitTTM": 206157000000,
  "totalAssets": 379297000000,
  "earningsTTM": 117777000000
}
Successful operation

betaAPI Plan
Get SEC filings for a company​#Copy link
Returns a list of SEC filings (10-K, 10-Q, etc.) for the given ticker, sorted by filing date descending (newest first).

Query Parameters
ticker
Type:string
required
Example
Stock ticker symbol (case-insensitive)

Responses

200
Successful operation

application/json
400
Missing required ticker parameter

401
Unauthorized

404
Filings not found for ticker

500
Internal server error

Request Example forget/equities/v1/filings

Shell Curl
Copy content
curl 'https://pro-api.llama.fi/<API-KEY>/equities/v1/filings'

Test Request
(get /equities/v1/filings)
Status:200
Status:400
Status:401
Status:404
Status:500
Copy content
[
  {
    "filingDate": "2025-02-28",
    "reportDate": "2024-12-31",
    "form": "10-K",
    "primaryDocumentUrl": "https://www.sec.gov/Archives/edgar/data/1679788/0001679788-25-000123/0001679788-25-000123.htm",
    "documentDescription": "Annual Report"
  }
]
Successful operation