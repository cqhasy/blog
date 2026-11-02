---
published: 2026-09-03
slug: "什么是nosql"
title: "什么是NoSQL:"
---
### 什么是NoSQL:

NoSQL 数据库（意即“不仅仅是 SQL”）（Not Only SQL）存储数据的方式与关系表不同。NoSQL 数据库的类型因数据模型而异。主要类型包括[文档](https://www.mongodb.com/zh-cn/document-databases)、键值、宽列和图形。它们提供了灵活的模式，可以随大量数据和高用户负载而轻松扩展。

人们使用“NoSQL 数据库”一词时，通常会使用它来指代任何非关系型数据库。有人说“NoSQL”代表“非 SQL”，而另一些人则说“不仅仅是 SQL”。无论哪种方式，大多数人都认为 NoSQL 数据库以更自然、更灵活的方式存储数据。NoSQL 是一种数据库管理方法，而 SQL 只是一种查询语言，与 NoSQL 数据库的查询语言类似。

##### 数据库类型 - NoSQL：

随着时间的推移，出现了四种主要的 [NoSQL 数据库类型](https://www.mongodb.com/zh-cn/scale/types-of-nosql-databases)：文档数据库、[键值数据库](https://www.mongodb.com/zh-cn/databases/key-value-database)、宽列存储数据库和图形数据库如今，多模型数据库也变得相当流行。mongoDB就是文档数据库。

### 为什么mongoDB：

**Bson:**   使用BSON存储数据，BSON（Binary JSON）和 JSON（JavaScript Object Notation）都用于存储和传输数据，但**BSON** 是 JSON 的**二进制扩展**，适用于 **MongoDB 数据库**和 **高效存储**，特别是当涉及到复杂的数据类型（如日期、二进制数据）时，BSON 更为高效。

**动态 Schema：** MongoDB 是一个无模式的数据库，允许文档结构（数据模式）在同一个集合中自由变化。这使得它特别适合存储复杂、变动的数据，如用户行为日志、社交媒体数据等。

**适应变化：** 在传统关系型数据库中，你必须提前定义好表结构。而在 MongoDB 中，数据的结构可以随时调整，不需要进行复杂的迁移或修改表结构操作。

**分片（Sharding）：** MongoDB 支持水平扩展（Sharding），这意味着可以将数据分布在多个服务器上，实现大规模分布式存储。随着数据量的增加，你可以通过增加服务器节点来扩展存储和处理能力。

**自动分片：** MongoDB 自动将数据划分成多个片段，并根据负载平衡这些片段，支持跨多个机器的分布式架构。

**快速读写：** MongoDB 对数据的插入、更新和查询有很高的性能。由于它是基于内存映射的存储引擎，读写操作通常非常快速。

**索引支持：** MongoDB 支持各种类型的索引，包括单字段索引、复合索引、地理空间索引等，能够大大提高查询性能。

**内存映射存储引擎：** MongoDB 使用内存映射存储引擎，在磁盘和内存之间高效交换数据，从而提升性能。

### 体系结构：

![img](https://i-blog.csdnimg.cn/blog_migrate/f8e0b28e2a41fef2c139e7165286658b.png)



### 如何创建副本集：

- MongoDB **副本集（Replica Set）** 是 MongoDB 提供的一种**高可用性**和**数据冗余**的机制。它通过多个 MongoDB 实例（节点）来保证数据的一致性，防止数据丢失，同时提供故障自动恢复能力。

#### 架构：

一个典型的 MongoDB 副本集由 **多个节点** 组成，每个节点扮演不同的角色：

- 主节点：负责处理**所有的写入和更新**，并将数据同步到从节点
- 从节点：复制主节点的数据，并可提供**只读查询**（可选）//默认不响应读请求。
- 仲裁节点：不存储数据，仅用于**参与主节点选举**

#### 选举机制：

何时选举：

1. Primary 宕机
2. **网络分区**
3. **管理员手动触发**
4. Primary 发生资源瓶颈（CPU、内存不足等）



流程：

1. Secondary 发现 Primary 不可用（大概10S）开始选举
2. **从节点投票**，得票最多的 Secondary 成为新 Primary。
3. 旧 Primary 恢复后，会变为 Secondary。

#### 优势：

MongoDB的副本集（Replica Set）是一组MongoDB进程实例的集合，其中的数据相互复制，并自动进行故障转移。    通过MongoDB的数据库复制，系统增加了冗余性，确保了高可用性，简化了管理任务，如备份，并且提升了读取性能。大多数生产部署都会采用复制功能。

**故障切换恢复**：  副本集能够自动进行故障切换和恢复。如果主节点（Primary）掉线或无响应，并且多数副本集成员能够相互连接，系统将选出一个新的主节点。  通常情况下，当主节点发生故障、不可用或不适合作为主节点时，在几秒内没有管理员干预，副本集会自动进行故障切换。展现出**高可用性**

如果MongoDB部署未按预期进行故障切换，则可能出现以下问题：

- 副本集剩余成员数量少于总数的一半
- 没有适合成为主节点的成员

回滚（Rollback）：
        在大多数情况下，回滚操作能够优雅地处理无法进行故障切换恢复的情况。回滚操作发生在主节点（Primary）处理写操作时，但在其他成员尚未成功复制该操作之前主节点掉线。当之前的主节点重新加入副本集并开始进行复制时，会出现回滚操作。如果操作已经成功复制到其他成员，并且这些成员可用且能够连接到大多数副本集成员，则不会发生回滚。回滚操作会删除那些尚未复制到其他成员的操作，以确保数据集的一致性。

关于一致性：
        在MongoDB中，所有针对主节点（Primary）的读操作都保证与最后一次写操作结果一致。如果客户端配置了允许从次要节点（Secondary）读取的读选项，读操作可能会从没有及时复制更新或操作的次要节点返回结果。在这种情况下，查询操作可能会返回之前的状态。这种行为有时被称为最终一致性，因为次要节点的状态最终会与主节点的状态一致。MongoDB不能保证从次要节点读取的读操作具有强一致性。 除非在配置写操作成功后，确保所有节点上的写操作都成功执行，否则无法保证从次要节点读取的一致性。但读性能有很大提升。

### 创建与连接：

这里介绍通过docker-compose的方式部署：

```yml
version: '3.8'

services:
  mongo1:
    image: crpi-ki2huoxfwubqvais.cn-beijing.personal.cr.aliyuncs.com/wordpress1234/mymongodb:latest
    container_name: mongo1
    ports:
      - "27017:27017"
    command: ["--replSet", "myReplicaSet", "--bind_ip_all"]
    networks:
      - mongo_network

  mongo2:
    image: crpi-ki2huoxfwubqvais.cn-beijing.personal.cr.aliyuncs.com/wordpress1234/mymongodb:latest
    container_name: mongo2
    ports:
      - "27018:27017"
    command: ["--replSet", "myReplicaSet", "--bind_ip_all"]
    networks:
      - mongo_network

  mongo3:
    image: crpi-ki2huoxfwubqvais.cn-beijing.personal.cr.aliyuncs.com/wordpress1234/mymongodb:latest
    container_name: mongo3
    ports:
      - "27019:27017"
    command: ["--replSet", "myReplicaSet", "--bind_ip_all"]
    networks:
      - mongo_network

networks:
  mongo_network:
    driver: bridge

```

```
//进入一个容器初始化
rs.initiate(
...    {
...       _id: "myReplicaSet",
...       members: [
...          { _id: 0, host: "your-ip:27017" },
...          { _id: 1, host: "your-ip:27018" },
...          { _id: 2, host: "your-ip:27019" }
...       ]
...    }
... )
rs.status()//检查是否初始化成功
```



```go
package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// MongoDB 副本集连接字符串
	uri := "mongodb://yourip17,yourip:27018,yourip:27019/?replicaSet=myReplicaSet"

	// 设置连接客户端的配置
	clientOptions := options.Client().
    ApplyURI(uri).
    SetReadPreference(readpref.Secondary()) // 只从 Secondary 读取

	// 连接到 MongoDB
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(context.Background())

	// 检查连接是否成功
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	fmt.Println("Connected to MongoDB!")

	// 选择数据库和集合
	collection := client.Database("test").Collection("mycollection")

	// 执行一个简单的查询
	var result bson.M
	err = collection.FindOne(context.Background(), bson.D{}).Decode(&result)
	if err != nil {
		log.Fatalf("Failed to find a document: %v", err)
	}

	// 输出查询结果
	fmt.Printf("Found document: %v\n", result)
}

```
