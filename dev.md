## 核心数据结构

```json
{
	"info": {
		"_postman_id": "536892b0-3886-4e66-86a6-722c946a2c08",
		"name": "shiiro",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "14623557"
	},
	"item": [
		{
			"name": "insertAirflowCode",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"name\":\"fetchData\",\r\n    \"code\":\"def fetchData(**kwargs):\\n    totalResult = []\\n    urls = kwargs['url'].split(',')\\n    page = kwargs['page']\\n    for url in urls:\\n        if page:\\n            cur_page = 1\\n            cur_data = []\\n            while(cur_page <= page):\\n                response = requests.get(url).json()\\n                if isinstance(response, list):\\n                    cur_data += response\\n                else:\\n                    cur_data.append(response)\\n                cur_page += 1\\n        else:\\n            response = requests.get(url).json()\\n            totalResult.append(response)\\n    return totalResult\\n\\nfetch_data = PythonOperator(\\n    task_id='fetch_data',\\n    provide_context=True,\\n    python_callable=fetchData,\\n    op_kwargs={\\\"url\\\": \\\"{{dag_run.conf['url']}}\\\", \\\"page\\\": \\\"{{dag_run.conf['page']}}\\\"},\\n    dag=dag)\",\r\n    \"actionId\":\"611cd408ff90ce4bc848c74f\",\r\n    \"imports\":[\r\n        \"from __future__ import print_function\",\r\n        \"import airflow\",\r\n        \"from airflow import DAG\",\r\n        \"from airflow.operators.python import PythonOperator\",\r\n        \"import requests\"\r\n    ]\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{shiiro}}/insertAirflowCode",
					"host": [
						"{{shiiro}}"
					],
					"path": [
						"insertAirflowCode"
					]
				}
			},
			"response": [
				{
					"name": "fetchData",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\":\"fetchData\",\r\n    \"code\":\"def fetch_data(**kwargs):\\n    totalResult = []\\n    urls = kwargs['url'].split('_&&_')\\n    page = kwargs['page']\\n    for url in urls:\\n        if page and page != 'None':\\n            cur_page = 1\\n            cur_data = []\\n            while(cur_page <= page):\\n                response = requests.get(url).json()\\n                if isinstance(response, list):\\n                    cur_data += response\\n                else:\\n                    cur_data.append(response)\\n                cur_page += 1\\n        else:\\n            response = requests.get(url).json()\\n            totalResult.append(response)\\n    return totalResult\\n\\nfetchData = PythonOperator(\\n    task_id='fetchData',\\n    provide_context=True,\\n    python_callable=fetch_data,\\n    op_kwargs={\\\"url\\\": \\\"{{dag_run.conf['url']}}\\\", \\\"page\\\": \\\"{{dag_run.conf['page']}}\\\"},\\n    dag=dag)\",\r\n    \"actionId\":\"611cd408ff90ce4bc848c74f\",\r\n    \"imports\":[\r\n        \"from __future__ import print_function\",\r\n        \"import airflow\",\r\n        \"from airflow import DAG\",\r\n        \"from airflow.operators.python import PythonOperator\",\r\n        \"import requests\"\r\n    ]\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertAirflowCode",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertAirflowCode"
							]
						}
					},
					"status": "OK",
					"code": 200,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "text/plain;charset=UTF-8"
						},
						{
							"key": "Content-Length",
							"value": "24"
						},
						{
							"key": "Date",
							"value": "Thu, 19 Aug 2021 05:42:21 GMT"
						}
					],
					"cookie": [],
					"body": "611def3d3f83dc657cd8e04e"
				},
				{
					"name": "analyzeData",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\":\"analyzeData\",\r\n    \"code\":\"def analyze_data(**kwargs):\\n    return kwargs['task_instance'].xcom_pull(task_ids='fetchData')\\n\\nanalyzeData = PythonOperator(\\n    task_id='analyzeData',\\n    provide_context=True,\\n    python_callable=analyze_data,\\n    dag=dag)\",\r\n    \"actionId\":\"611cd47aff90ce4bc848c750\",\r\n    \"imports\":[\r\n    ]\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertAirflowCode",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertAirflowCode"
							]
						}
					},
					"status": "OK",
					"code": 200,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "text/plain;charset=UTF-8"
						},
						{
							"key": "Content-Length",
							"value": "24"
						},
						{
							"key": "Date",
							"value": "Thu, 19 Aug 2021 06:02:31 GMT"
						}
					],
					"cookie": [],
					"body": "611df3f70a593f4b6577777e"
				},
				{
					"name": "saveData",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\":\"saveData\",\r\n    \"code\":\"def save_data(**kwargs):\\n    data = kwargs['task_instance'].xcom_pull(task_ids='analyzeData')\\n    myclient = pymongo.MongoClient(kwargs['mongoUri'])\\n    mydb = myclient[kwargs['mongoDatabase']]\\n    mycol = mydb[kwargs['mongoCollection']]\\n    x = mycol.insert_many(data)\\n    # print(x.inserted_ids)\\n\\nsaveData = PythonOperator(\\n    task_id='saveData',\\n    provide_context=True,\\n    python_callable=save_data,\\n    op_kwargs={'mongoUri': \\\"{{dag_run.conf['mongoUri']}}\\\", 'mongoDatabase': \\\"{{dag_run.conf['mongoDatabase']}}\\\", 'mongoCollection': \\\"{{dag_run.conf['mongoCollection']}}\\\"},\\n    dag=dag)\",\r\n    \"actionId\":\"611debfdff90ce4bc848c751\",\r\n    \"imports\":[\r\n        \"import pymongo\"\r\n    ]\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertAirflowCode",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertAirflowCode"
							]
						}
					},
					"status": "OK",
					"code": 200,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "text/plain;charset=UTF-8"
						},
						{
							"key": "Content-Length",
							"value": "24"
						},
						{
							"key": "Date",
							"value": "Thu, 19 Aug 2021 06:02:31 GMT"
						}
					],
					"cookie": [],
					"body": "611df3f70a593f4b6577777e"
				}
			]
		},
		{
			"name": "findAirflowCode",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"airflowCodeId\":\"611def3d3f83dc657cd8e04e\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{shiiro}}/findAirflowCode",
					"host": [
						"{{shiiro}}"
					],
					"path": [
						"findAirflowCode"
					]
				}
			},
			"response": []
		},
		{
			"name": "insertAction",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"name\": \"fetchData\",\r\n    \"requestType\": \"{\\\"url\\\":\\\"String\\\"}\",\r\n    \"responseType\": \"any\",\r\n    \"description\": \"获取url中的数据，支持分页\",\r\n    \"variableTypes\": [\r\n        {\r\n            \"required\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"调用url\",\r\n            \"path\": \"url\",\r\n            \"defaultValue\": null\r\n        },\r\n        {\r\n            \"required\": false,\r\n            \"type\": \"NUMBER\",\r\n            \"name\": \"页数，url中使用{{cur_page}}来达成翻页\",\r\n            \"path\": \"page\",\r\n            \"defaultValue\": null\r\n        }\r\n    ]\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{shiiro}}/insertAction",
					"host": [
						"{{shiiro}}"
					],
					"path": [
						"insertAction"
					]
				}
			},
			"response": [
				{
					"name": "fetchData",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"fetchData\",\r\n    \"requestType\": \"{\\\"url\\\":\\\"String\\\"}\",\r\n    \"responseType\": \"any\",\r\n    \"description\": \"获取url中的数据，支持分页\",\r\n    \"variableTypes\": [\r\n        {\r\n            \"required\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"调用url\",\r\n            \"path\": \"url\",\r\n            \"defaultValue\": null\r\n        },\r\n        {\r\n            \"required\": false,\r\n            \"type\": \"NUMBER\",\r\n            \"name\": \"页数，url中使用{{cur_page}}来达成翻页\",\r\n            \"path\": \"page\",\r\n            \"defaultValue\": null\r\n        }\r\n    ]\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertAction",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertAction"
							]
						}
					},
					"status": "OK",
					"code": 200,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "text/plain;charset=UTF-8"
						},
						{
							"key": "Content-Length",
							"value": "24"
						},
						{
							"key": "Date",
							"value": "Wed, 18 Aug 2021 09:34:04 GMT"
						}
					],
					"cookie": [],
					"body": "611cd408ff90ce4bc848c74f"
				},
				{
					"name": "analyzeData",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"analyzeData\",\r\n    \"requestType\": \"{}\",\r\n    \"responseType\": \"any\",\r\n    \"description\": \"解析数据并转换\",\r\n    \"variableTypes\": []\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertAction",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertAction"
							]
						}
					},
					"status": "OK",
					"code": 200,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "text/plain;charset=UTF-8"
						},
						{
							"key": "Content-Length",
							"value": "24"
						},
						{
							"key": "Date",
							"value": "Wed, 18 Aug 2021 09:35:59 GMT"
						}
					],
					"cookie": [],
					"body": "611cd47aff90ce4bc848c750"
				},
				{
					"name": "saveData",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"saveData\",\r\n    \"requestType\": \"{\\\"mongoUri\\\":\\\"String\\\",\\\"mongoDatabase\\\":\\\"String\\\",\\\"mongoCollection\\\":\\\"String\\\"}\",\r\n    \"responseType\": \"none\",\r\n    \"description\": \"保存数据到mongo\",\r\n    \"variableTypes\": [\r\n        {\r\n            \"required\": false,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"mongo连接串\",\r\n            \"path\": \"mongoUri\",\r\n            \"defaultValue\": \"mongodb://t_flttsworkstruct:HW3cp57rCtgk9DKUmFEz@flttsworkstruct01.mongo.db.fat.qa.nt.ctripcorp.com:55111/flttsworkstructdb?replicaSet=fatflttsworkstruct\"\r\n        },\r\n        {\r\n            \"required\": false,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"mongoDatabase\",\r\n            \"path\": \"mongoDatabase\",\r\n            \"defaultValue\": \"flttsworkstructdb\"\r\n        },\r\n        {\r\n            \"required\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"mongo集合\",\r\n            \"path\": \"mongoCollection\",\r\n            \"defaultValue\": null\r\n        }\r\n    ]\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertAction",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertAction"
							]
						}
					},
					"status": "OK",
					"code": 200,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "text/plain;charset=UTF-8"
						},
						{
							"key": "Content-Length",
							"value": "24"
						},
						{
							"key": "Date",
							"value": "Thu, 19 Aug 2021 05:28:29 GMT"
						}
					],
					"cookie": [],
					"body": "611debfdff90ce4bc848c751"
				},
				{
					"name": "insertAction",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"fetchData\",\r\n    \"requestType\": \"{\\\"url\\\":\\\"String\\\"}\",\r\n    \"responseType\": \"any\",\r\n    \"description\": \"获取url中的数据，支持分页\",\r\n    \"variableTypes\": [\r\n        {\r\n            \"required\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"调用url\",\r\n            \"path\": \"url\",\r\n            \"defaultValue\": null\r\n        },\r\n        {\r\n            \"required\": false,\r\n            \"type\": \"NUMBER\",\r\n            \"name\": \"页数，url中使用{{cur_page}}来达成翻页\",\r\n            \"path\": \"page\",\r\n            \"defaultValue\": null\r\n        }\r\n    ]\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertAction",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertAction"
							]
						}
					},
					"_postman_previewlanguage": null,
					"header": null,
					"cookie": [],
					"body": null
				}
			]
		},
		{
			"name": "insertTemplate",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"name\": \"通用简单数据收集\",\r\n    \"actionGroup\": {\r\n        \"actions\": [\r\n            {\r\n                \"id\": \"611cd408ff90ce4bc848c74f\",\r\n                \"name\": \"fetchData\",\r\n                \"updateTime\": \"2021-08-18 17:34:00.454\"\r\n            },\r\n            {\r\n                \"id\": \"611cd47aff90ce4bc848c750\",\r\n                \"name\": \"analyzeData\",\r\n                \"updateTime\": \"2021-08-18 17:35:54.696\"\r\n            },\r\n            {\r\n                \"id\": \"611debfdff90ce4bc848c751\",\r\n                \"name\": \"saveData\",\r\n                \"updateTime\": \"2021-08-19 13:28:29.934\"\r\n            }\r\n        ],\r\n        \"actionEdges\": [\r\n            {\r\n                \"fromId\": \"611cd408ff90ce4bc848c74f\",\r\n                \"fromName\": \"fetchData\",\r\n                \"toId\": \"611cd47aff90ce4bc848c750\",\r\n                \"toName\": \"analyzeData\"\r\n            },\r\n            {\r\n                \"fromId\": \"611cd47aff90ce4bc848c750\",\r\n                \"fromName\": \"analyzeData\",\r\n                \"toId\": \"611debfdff90ce4bc848c751\",\r\n                \"toName\": \"saveData\"\r\n            }\r\n        ]\r\n    },\r\n    \"variableTypes\": [\r\n        {\r\n            \"required\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"调用url\",\r\n            \"path\": \"url\",\r\n            \"defaultValue\": null\r\n        },\r\n        {\r\n            \"required\": false,\r\n            \"type\": \"NUMBER\",\r\n            \"name\": \"页数，url中使用{{cur_page}}来达成翻页\",\r\n            \"path\": \"page\",\r\n            \"defaultValue\": null\r\n        },\r\n        {\r\n            \"defaultValue\": \"mongodb://t_flttsworkstruct:HW3cp57rCtgk9DKUmFEz@flttsworkstruct01.mongo.db.fat.qa.nt.ctripcorp.com:55111/flttsworkstructdb?replicaSet=fatflttsworkstruct\",\r\n            \"name\": \"mongo连接串\",\r\n            \"path\": \"mongoUri\",\r\n            \"required\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"defaultValue\": \"flttsworkstructdb\",\r\n            \"name\": \"mongoDatabase\",\r\n            \"path\": \"mongoDatabase\",\r\n            \"required\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"name\": \"mongo集合\",\r\n            \"path\": \"mongoCollection\",\r\n            \"required\": true,\r\n            \"type\": \"STRING\"\r\n        }\r\n    ],\r\n    \"chartTypes\": [],\r\n    \"apiTypes\": []\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{shiiro}}/insertTemplate",
					"host": [
						"{{shiiro}}"
					],
					"path": [
						"insertTemplate"
					]
				}
			},
			"response": [
				{
					"name": "insertTemplate",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"通用简单数据收集\",\r\n    \"actionGroup\": {\r\n        \"actions\": [\r\n            {\r\n                \"id\": \"611cd408ff90ce4bc848c74f\",\r\n                \"name\": \"fetchData\",\r\n                \"updateTime\": \"2021-08-18 17:34:00.454\"\r\n            },\r\n            {\r\n                \"id\": \"611cd47aff90ce4bc848c750\",\r\n                \"name\": \"analyzeData\",\r\n                \"updateTime\": \"2021-08-18 17:35:54.696\"\r\n            },\r\n            {\r\n                \"id\": \"611debfdff90ce4bc848c751\",\r\n                \"name\": \"saveData\",\r\n                \"updateTime\": \"2021-08-19 13:28:29.934\"\r\n            }\r\n        ],\r\n        \"actionEdges\": [\r\n            {\r\n                \"fromId\": \"611cd408ff90ce4bc848c74f\",\r\n                \"fromName\": \"fetchData\",\r\n                \"toId\": \"611cd47aff90ce4bc848c750\",\r\n                \"toName\": \"analyzeData\"\r\n            },\r\n            {\r\n                \"fromId\": \"611cd47aff90ce4bc848c750\",\r\n                \"fromName\": \"analyzeData\",\r\n                \"toId\": \"611debfdff90ce4bc848c751\",\r\n                \"toName\": \"saveData\"\r\n            }\r\n        ]\r\n    },\r\n    \"variableTypes\": [\r\n        {\r\n            \"required\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"调用url\",\r\n            \"path\": \"url\",\r\n            \"defaultValue\": null\r\n        },\r\n        {\r\n            \"required\": false,\r\n            \"type\": \"NUMBER\",\r\n            \"name\": \"页数，url中使用{{cur_page}}来达成翻页\",\r\n            \"path\": \"page\",\r\n            \"defaultValue\": null\r\n        },\r\n        {\r\n            \"defaultValue\": \"mongodb://t_flttsworkstruct:HW3cp57rCtgk9DKUmFEz@flttsworkstruct01.mongo.db.fat.qa.nt.ctripcorp.com:55111/flttsworkstructdb?replicaSet=fatflttsworkstruct\",\r\n            \"name\": \"mongo连接串\",\r\n            \"path\": \"mongoUri\",\r\n            \"required\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"defaultValue\": \"flttsworkstructdb\",\r\n            \"name\": \"mongoDatabase\",\r\n            \"path\": \"mongoDatabase\",\r\n            \"required\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"name\": \"mongo集合\",\r\n            \"path\": \"mongoCollection\",\r\n            \"required\": true,\r\n            \"type\": \"STRING\"\r\n        }\r\n    ],\r\n    \"chartTypes\": [],\r\n    \"apiTypes\": []\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertTemplate",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertTemplate"
							]
						}
					},
					"status": "Internal Server Error",
					"code": 500,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "application/json;charset=UTF-8"
						},
						{
							"key": "Transfer-Encoding",
							"value": "chunked"
						},
						{
							"key": "Date",
							"value": "Fri, 20 Aug 2021 02:17:19 GMT"
						},
						{
							"key": "Connection",
							"value": "close"
						}
					],
					"cookie": [],
					"body": "{\"timestamp\":1629425839188,\"status\":500,\"error\":\"Internal Server Error\",\"exception\":\"java.lang.NullPointerException\",\"message\":\"No message available\",\"path\":\"/insertTemplate\"}"
				}
			]
		},
		{
			"name": "insertJob",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"name\": \"sonar数据收集\",\r\n    \"type\": \"AIRFLOW\",\r\n    \"template\": {\r\n        \"id\": \"611f1071931cb476ee1fb337\",\r\n        \"name\": \"通用简单数据收集\",\r\n        \"updateTime\": \"2021-08-20 10:16:17.672\"\r\n    },\r\n    \"variableInstance\": [\r\n        {\r\n            \"showForUser\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"调用url\",\r\n            \"path\": \"url\",\r\n            \"value\": \"http://sonarqube.ci.release.ctripcorp.com/api/measures/component?metricKeys=ncloc,complexity,violations,comment_lines,comment_lines_density,code_smells,sqale_index,alert_status,quality_gate_details,branch_coverage,new_coverage,classes,reliability_rating,bugs&component=com.ctrip.flight.intl.agg.multiticket:aggmultiticketservice\"\r\n        },\r\n        {\r\n            \"showForUser\": false,\r\n            \"type\": \"NUMBER\",\r\n            \"name\": \"页数，url中使用{{cur_page}}来达成翻页\",\r\n            \"path\": \"page\",\r\n            \"value\": null\r\n        },\r\n        {\r\n            \"value\": \"mongodb://t_flttsworkstruct:HW3cp57rCtgk9DKUmFEz@flttsworkstruct01.mongo.db.fat.qa.nt.ctripcorp.com:55111/flttsworkstructdb?replicaSet=fatflttsworkstruct\",\r\n            \"name\": \"mongo连接串\",\r\n            \"path\": \"mongoUri\",\r\n            \"showForUser\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"value\": \"flttsworkstructdb\",\r\n            \"name\": \"mongoDatabase\",\r\n            \"path\": \"mongoDatabase\",\r\n            \"showForUser\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"name\": \"mongo集合\",\r\n            \"path\": \"mongoCollection\",\r\n            \"showForUser\": true,\r\n            \"type\": \"STRING\",\r\n            \"value\": \"sonar_metrics\"\r\n        }\r\n    ],\r\n    \"chartInstance\": [],\r\n    \"apiInstance\": [],\r\n    \"schedules\": [],\r\n    \"jobConfig\": {}\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{shiiro}}/insertJob",
					"host": [
						"{{shiiro}}"
					],
					"path": [
						"insertJob"
					]
				}
			},
			"response": [
				{
					"name": "insertJob",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"sonar_data_collect\",\r\n    \"type\": \"AIRFLOW\",\r\n    \"template\": {\r\n        \"id\": \"611f1071931cb476ee1fb337\",\r\n        \"name\": \"通用简单数据收集\",\r\n        \"updateTime\": \"2021-08-20 10:16:17.672\"\r\n    },\r\n    \"variableInstance\": [\r\n        {\r\n            \"showForUser\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"调用url\",\r\n            \"path\": \"url\",\r\n            \"value\": \"http://sonarqube.ci.release.ctripcorp.com/api/measures/component?metricKeys=ncloc,complexity,violations,comment_lines,comment_lines_density,code_smells,sqale_index,alert_status,quality_gate_details,branch_coverage,new_coverage,classes,reliability_rating,bugs&component=com.ctrip.flight.intl.agg.multiticket:aggmultiticketservice\"\r\n        },\r\n        {\r\n            \"showForUser\": false,\r\n            \"type\": \"NUMBER\",\r\n            \"name\": \"页数，url中使用{{cur_page}}来达成翻页\",\r\n            \"path\": \"page\",\r\n            \"value\": null\r\n        },\r\n        {\r\n            \"value\": \"mongodb://t_flttsworkstruct:HW3cp57rCtgk9DKUmFEz@flttsworkstruct01.mongo.db.fat.qa.nt.ctripcorp.com:55111/flttsworkstructdb?replicaSet=fatflttsworkstruct\",\r\n            \"name\": \"mongo连接串\",\r\n            \"path\": \"mongoUri\",\r\n            \"showForUser\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"value\": \"flttsworkstructdb\",\r\n            \"name\": \"mongoDatabase\",\r\n            \"path\": \"mongoDatabase\",\r\n            \"showForUser\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"name\": \"mongo集合\",\r\n            \"path\": \"mongoCollection\",\r\n            \"showForUser\": true,\r\n            \"type\": \"STRING\",\r\n            \"value\": \"sonar_metrics\"\r\n        }\r\n    ],\r\n    \"chartInstance\": [],\r\n    \"apiInstance\": [],\r\n    \"schedules\": [],\r\n    \"jobConfig\": {}\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertJob",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertJob"
							]
						}
					},
					"status": "OK",
					"code": 200,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "text/plain;charset=UTF-8"
						},
						{
							"key": "Content-Length",
							"value": "24"
						},
						{
							"key": "Date",
							"value": "Fri, 20 Aug 2021 06:56:11 GMT"
						}
					],
					"cookie": [],
					"body": "611f520854bc5608956b364c"
				}
			]
		},
		{
			"name": "triggerJob",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"jobId\":\"611f520854bc5608956b364c\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "{{shiiro}}/triggerJob",
					"host": [
						"{{shiiro}}"
					],
					"path": [
						"triggerJob"
					]
				}
			},
			"response": [
				{
					"name": "insertJob",
					"originalRequest": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"sonar_data_collect\",\r\n    \"type\": \"AIRFLOW\",\r\n    \"template\": {\r\n        \"id\": \"611f1071931cb476ee1fb337\",\r\n        \"name\": \"通用简单数据收集\",\r\n        \"updateTime\": \"2021-08-20 10:16:17.672\"\r\n    },\r\n    \"variableInstance\": [\r\n        {\r\n            \"showForUser\": true,\r\n            \"type\": \"STRING\",\r\n            \"name\": \"调用url\",\r\n            \"path\": \"url\",\r\n            \"value\": \"http://sonarqube.ci.release.ctripcorp.com/api/measures/component?metricKeys=ncloc,complexity,violations,comment_lines,comment_lines_density,code_smells,sqale_index,alert_status,quality_gate_details,branch_coverage,new_coverage,classes,reliability_rating,bugs&component=com.ctrip.flight.intl.agg.multiticket:aggmultiticketservice\"\r\n        },\r\n        {\r\n            \"showForUser\": false,\r\n            \"type\": \"NUMBER\",\r\n            \"name\": \"页数，url中使用{{cur_page}}来达成翻页\",\r\n            \"path\": \"page\",\r\n            \"value\": null\r\n        },\r\n        {\r\n            \"value\": \"mongodb://t_flttsworkstruct:HW3cp57rCtgk9DKUmFEz@flttsworkstruct01.mongo.db.fat.qa.nt.ctripcorp.com:55111/flttsworkstructdb?replicaSet=fatflttsworkstruct\",\r\n            \"name\": \"mongo连接串\",\r\n            \"path\": \"mongoUri\",\r\n            \"showForUser\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"value\": \"flttsworkstructdb\",\r\n            \"name\": \"mongoDatabase\",\r\n            \"path\": \"mongoDatabase\",\r\n            \"showForUser\": false,\r\n            \"type\": \"STRING\"\r\n        },\r\n        {\r\n            \"name\": \"mongo集合\",\r\n            \"path\": \"mongoCollection\",\r\n            \"showForUser\": true,\r\n            \"type\": \"STRING\",\r\n            \"value\": \"sonar_metrics\"\r\n        }\r\n    ],\r\n    \"chartInstance\": [],\r\n    \"apiInstance\": [],\r\n    \"schedules\": [],\r\n    \"jobConfig\": {}\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{shiiro}}/insertJob",
							"host": [
								"{{shiiro}}"
							],
							"path": [
								"insertJob"
							]
						}
					},
					"status": "OK",
					"code": 200,
					"_postman_previewlanguage": "JSON",
					"header": [
						{
							"key": "Server",
							"value": "Apache-Coyote/1.1"
						},
						{
							"key": "Content-Type",
							"value": "text/plain;charset=UTF-8"
						},
						{
							"key": "Content-Length",
							"value": "24"
						},
						{
							"key": "Date",
							"value": "Fri, 20 Aug 2021 06:56:11 GMT"
						}
					],
					"cookie": [],
					"body": "611f520854bc5608956b364c"
				}
			]
		}
	]
}
```
