---
published: 2026-09-08
slug: "graphql-a-data-query-language"
title: "GraphQL ----A data query language"
---
# GraphQL ----A data query language

## GraphQL是什么？

GraphQL是Facebook创建的API格式。以下是从官方网页引用的内容。

GraphQL是一种用于API的查询语言，它是用服务器端运行环境来执行查询的，通过定义的类型系统来对数据进行查询

## 为什么需要Graphql？

1. 客户端决定结果——————————无论是rest异或是rpc,都是由服务端定义请求的参数和返回的响应，比如请求用户信息，可能有简单的直接请求用户的name与avater,也可能会有请求用户的详细信息，如果要实现相应的功能，可能我们会要分成两个路由或者请求中带有0值来不做处理，返回时分开返回或者不请求的返回0值，如果在大型应用中，这种的处理方法无疑会让整体变得臃肿且复杂。 GraphQL 中，查询的规范是在客户端编码而不是在服务器端。这些查询是以字段级别的粒度指定的，GraphQL 查询精确地返回客户端所请求的内容，不多也不少。
2. 天生具有高版本兼容————————在打造产品尤其是移动端应用时，经常会有多版本共存的情况，如果是使用rest+json的形式的话，新版本的更新可能会导致某些接口出现破坏性的改变，进而导致需要单独维护旧版本的接口，造成运维方面的困难。客户端指定的查询简化了管理我们的向后兼容保证
3. 分层结构：当今大多数产品开发都涉及视图层次结构的创建和操作。为了与应用的结构保持一致，GraphQL 查询本身就是一个分层的字段集合。查询的形状就像它返回的数据一样。这是一种产品工程师描述数据需求的自然方式。
4. 强类型：GraphQL 是强类型的。给定一个查询，工具可以在执行前确保该查询在语法上正确且在 GraphQL 类型系统中有效，即在开发时间，服务器也可以对响应的形状和性质做出某些保证。这使得构建高质量的客户端工具更加容易。

## GraphQL的几个重要概念

type(类型系统)：用来定义返回的数据类型

```graphql
#基本类型：
Int     # 整数
Float   # 浮点数
String  # 字符串
Boolean # 布尔
ID      # 唯一标识符
#结构体
type User {
  id: ID!
  name: String!
  age: Int
}!表示非空
```

query(查询)：可以类比成restful的请求结构体或者query等，只不过这个是由客户端决定,只取需要的字段，避免 REST 的“过多或过少数据”问题

```graphql
query {
  user(id: 1) {
    name
    age
  }
}
{
  "data": {
    "user": {
      "name": "Alice",
      "age": 25
    }
  }
}
```

Mutation(变更)：用于修改数据（增删改）

```graphql
mutation {
  createUser(input: {name: "Bob", age: 20}) {
    id
    name
  }
}
{
  "data": {
    "createUser": {
      "id": "2",
      "name": "Bob"
    }
  }
}
```

reslover(解析器)，这里一般就是核心逻辑，比如从数据库查询数据等。

```graphql
const resolvers = {
  Query: {
    user: (parent, args, context) => {
      return db.getUserById(args.id)
    }
  }
}
```

schema(蓝图)整合了query和mutation，如果将mvc的service看作mutation，schema就有点像router。定义 API 的数据结构、类型系统和可操作的接口

```graphql
schema {
  query: Query
  mutation: Mutation
}
```

Subscription(订阅):实现实时更新(如聊天室、股票行情等),应该是用在websocket中，还没太用过

```grapuql
subscription {
  messageAdded {
    id
    content
    author {
      name
    }
  }
}
```

下面来看看在go语言中怎么使用吧，目前比较热门的包分别是gqlgen与graphql-go，其中gqlgen更自动化，用起来更顺手，graphql-go比较底层，很多东西需要自己写。

```go
//graphql-go
package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
)

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}

// 模拟数据库
var users = []User{
	{ID: "1", Name: "Alice", Age: 23},
	{ID: "2", Name: "Bob", Age: 25},
}

func main() {
	// 定义 GraphQL Object Type：User
	userType := graphql.NewObject(graphql.ObjectConfig{
		Name: "User",
		Fields: graphql.Fields{
			"id":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"name": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"age":  &graphql.Field{Type: graphql.Int},
		},
	})

	// 定义 Query
	rootQuery := graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"users": &graphql.Field{
				Type: graphql.NewList(userType),
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return users, nil
				},
			},
			"user": &graphql.Field{
				Type: userType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					id := p.Args["id"].(string)
					for _, u := range users {
						if u.ID == id {
							return u, nil
						}
					}
					return nil, nil
				},
			},
		},
	})

	// 定义 Mutation
	rootMutation := graphql.NewObject(graphql.ObjectConfig{
		Name: "Mutation",
		Fields: graphql.Fields{
			"createUser": &graphql.Field{
				Type: userType,
				Args: graphql.FieldConfigArgument{
					"name": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"age": &graphql.ArgumentConfig{
						Type: graphql.Int,
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					name := p.Args["name"].(string)
					age, _ := p.Args["age"].(int)
					user := User{
						ID:   string(rune(len(users) + 1)),
						Name: name,
						Age:  age,
					}
					users = append(users, user)
					return user, nil
				},
			},
		},
	})

		// 构建 Schema
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query:    rootQuery,
		Mutation: rootMutation,
	})
	if err != nil {
		log.Fatalf("创建 Schema 失败: %v", err)
	}

	// 创建 GraphQL handler（带 playground）
	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true, // 打开 GraphQL Playground
	})
	// 注册路由
	http.Handle("/graphql", h)

	log.Println("GraphQL server running at http://localhost:8080/graphql")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

由于swag并不直接支持graphql，所以我们使用了GraphiQL，这是一个web的ide工具吧，可以帮助我们去执行graphql的各种服务并测试，也方便前后端的对接。我找到一种用SpectaQL来生成文档的方法(但感觉不如原生的，只是看着方便点)。

```sh
npm install -g spectaql #安装工具
```

创建.yml文件

```json
title: "GraphQL API"
description: "自动生成的 GraphQL 文档"
logoUrl: ""
introspection:
  url: "http://localhost:8080/graphql"//可以用。graphql文件代替
servers:
  - url: "http://localhost:8080/graphql"  # GraphQL 服务地址
build:
  outputDir: "docs"
```

```sh
spectaql xxx.yml#这会生成对应得html
```

日后有时间可以研究一下这篇文章[Swag与GraphQL：混合API文档生成解决方案-CSDN博客](https://blog.csdn.net/gitblog_00229/article/details/151247311)

下面我们来看看gqlgen:

使用gqlgen，我们不需要去操心那复杂的组装逻辑，只需要定义方法与数据结构并实现方法，其余的事情都会通过ast插桩映射帮你完成，首先我们需要创建一个gqlgen.yml和schema.graphqls

```yml
schema:
  - graph/schema.graphqls

exec:
  filename: graph/generated/generated.go
  package: generated

model:
  filename: graph/model/models_gen.go
  package: model

resolver:
  layout: follow-schema
  dir: graph
  package: graph
```

```graphql
type User {
    id: ID!
    name: String!
    age: Int!
}

type Query {
    users: [User!]
    user(id: ID!): User
}

type Mutation {
    createUser(name: String!,age: Int!) :User!
}
```

然后运行

```sh
 go run github.com/99designs/gqlgen generate
```

下面是一个示例main文件

```go
package main

import (
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"gragen-ex/graph"
	"gragen-ex/graph/generated"
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "8080"

func main() {
	port := defaultPort

	// 创建 GraphQL server
	srv := handler.New(generated.NewExecutableSchema(generated.Config{
		Resolvers: &graph.Resolver{},
	}))
	srv.AddTransport(transport.POST{}) // 支持 POST 请求
	srv.AddTransport(transport.GET{})  // 支持 GET 请求（query string）
	srv.AddTransport(transport.Websocket{})
	http.Handle("/graphql", srv)
	http.Handle("/", playground.Handler("GraphQL Playground", "/graphql"))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

```



## 注意

GraphQL需要注意避免过量请求。

由于graphql并不像rest那样死板，我可以同时请求多个方法的数据，或者嵌套请求，这就导致返回的数据量可能会很大，需要做一定的限制和限流，时间有限，还没来的及研究，下次一定捏😆

代码仓库：[cqhasy/learn-gra](https://github.com/cqhasy/learn-gra)

参考资料:[GraphQL 入门——React 博客 --- GraphQL Introduction – React Blog](https://legacy.reactjs.org/blog/2015/05/01/graphql-introduction.html)

[GraphQL: A data query language | GraphQL](https://graphql.org/blog/2015-09-14-graphql/)

[Building GraphQL servers in golang — gqlgen](https://gqlgen.com/getting-started/)

[gqlgen](https://gqlgen.com/)

[使用GraphQL生成API文档 - Oinone社区](https://doc.oinone.top/chan-pin-shi-yong-shou-ce/17412.html)
