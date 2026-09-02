---
slug: "cobra"
title: "cobra"
---
# cobra

Cobra 是一个强大的命令行库，常用于创建命令行应用程序，具有支持子命令、标志、自动帮助、命令解析等功能。它使得开发者可以非常方便地创建和管理命令行工具。

### 1. **安装 Cobra**

首先，你需要安装 Cobra 库。可以通过 `go get` 来安装：

```go
go get -u github.com/spf13/cobra@latest
```

### 2. **Cobra 基本结构**

Cobra 的基本结构由命令（command）组成。每个命令可以有自己的子命令，也可以有一些标志（flags）用于设置命令的行为。

### 3. **创建一个简单的命令行应用**

#### 代码结构：

```go
package main

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

// 创建根命令
var rootCmd = &cobra.Command{
	Use:   "cliapp",  // 命令名称
	Short: "A brief description of your application",
	Long:  "A longer description of your application that explains its features in more detail.",
	Run: func(cmd *cobra.Command, args []string) {//args 用户输入的参数
		fmt.Println("Welcome to the CLI app!")
	},
}

// 启动命令行工具
func main() {
	// 执行命令
	if err := rootCmd.Execute(); err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
}
```

#### 解释：

- `Use`：命令名称，可以在命令行中使用。
- `Short`：命令的简短描述，常用于 `--help`。
- `Long`：命令的详细描述。
- `Run`：当命令执行时运行的函数。

#### 运行：

```go
go run main.go cliapp
```

输出：

```go
Welcome to the CLI app!
```

### 4. **添加子命令**

在 Cobra 中，命令可以有子命令。每个子命令也有自己的功能。

#### 代码：

```go
package main

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

// 根命令
var rootCmd = &cobra.Command{
	Use:   "cliapp",
	Short: "A simple CLI application",
}

// sayHello 子命令
var sayHelloCmd = &cobra.Command{
	Use:   "sayhello",
	Short: "Prints 'Hello, World!'",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Hello, World!")
	},
}

// sayGoodbye 子命令
var sayGoodbyeCmd = &cobra.Command{
	Use:   "saygoodbye",
	Short: "Prints 'Goodbye, World!'",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Goodbye, World!")
	},
}

// 启动命令行工具
func main() {
	// 将子命令添加到根命令
	rootCmd.AddCommand(sayHelloCmd)
	rootCmd.AddCommand(sayGoodbyeCmd)

	// 执行命令
	if err := rootCmd.Execute(); err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
}
```

#### 运行：

```go
go run main.go sayhello
go run main.go saygoodbye
```

输出：

```go

Hello, World!

```

输出：

```go

Goodbye, World!
```

### 5. **添加标志（Flags）**

标志（Flags）是命令行工具中用于控制命令行为的参数，可以是布尔值、字符串、整数等。Cobra 提供了 `Flags()` 和 `PersistentFlags()` 两种标志类型。

#### 示例：添加一个 `-v` 标志来显示版本信息

```go
package main

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

// 根命令
var rootCmd = &cobra.Command{
	Use:   "cliapp",
	Short: "A simple CLI application",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("CLI App executed!")
	},
}

// 版本标志
var version string

// 启动命令行工具
func main() {
	// 添加版本标志
	rootCmd.Flags().StringVarP(&version, "version", "v", "", "Show version")

	// 在执行命令时显示版本
	rootCmd.Run = func(cmd *cobra.Command, args []string) {
		if version != "" {
			fmt.Println("Version:", version)
		} else {
			fmt.Println("CLI App executed!")
		}
	}

	// 执行命令
	if err := rootCmd.Execute(); err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
}
```

#### 运行：

```go
go run main.go -v 1.0.0
```

输出：

```
Version: 1.0.0
```

### 6. **持久标志与本地标志**

- **持久标志**：可以被根命令和所有子命令共享。
- **本地标志**：只能用于当前命令。

```go
package main

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

var rootCmd = &cobra.Command{
	Use:   "cliapp",
	Short: "A simple CLI application",
}

var sayHelloCmd = &cobra.Command{
	Use:   "sayhello",
	Short: "Say hello",
	Run: func(cmd *cobra.Command, args []string) {
		name, _ := cmd.Flags().GetString("name")
		fmt.Println("Hello, " + name)
	},
}

func main() {
	// 添加本地标志到 sayHelloCmd
	sayHelloCmd.Flags().StringP("name", "n", "World", "Your name")

	// 添加 sayHello 子命令到根命令
	rootCmd.AddCommand(sayHelloCmd)

	// 执行命令
	if err := rootCmd.Execute(); err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
}
```

#### 运行：

```go
go run main.go sayhello -n John
```

输出：

```go
Hello, John
```

### 7. **命令的帮助信息**

Cobra 会自动生成帮助信息。当你在命令后面加上 `-h` 或 `--help` 时，Cobra 会显示帮助信息。

```go
go run main.go sayhello -h
```

输出：

```go
Usage:
  cliapp sayhello [flags]

Flags:
  -h, --help   help for sayhello
  -n, --name string   Your name (default "World")
```

### 8. **组织命令（使用子命令模块）**

随着命令变得复杂，通常我们会将子命令分开到不同的包中。这有助于代码的组织和维护。

```go
package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
)

var sayHelloCmd = &cobra.Command{
	Use:   "sayhello",
	Short: "Say hello",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Hello, World!")
	},
}

func init() {
	// 注册子命令
	rootCmd.AddCommand(sayHelloCmd)
}
```

然后在主函数中引入该命令模块：

```go
package main

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
	"yourmodule/cmd"
)

var rootCmd = &cobra.Command{
	Use:   "cliapp",
	Short: "A simple CLI application",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("CLI App executed!")
	},
}

func main() {
	// 启动命令行工具
	if err := rootCmd.Execute(); err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
}
```

### 总结：

Cobra 是一个功能强大的命令行库，能够帮助你快速构建复杂的命令行工具。通过简单的命令结构、子命令、标志和自动帮助，你可以实现高效且灵活的命令行应用。

关键点：

- **根命令和子命令**：通过 `AddCommand` 添加子命令。
- **标志**：支持持久标志和本地标志。
- **帮助信息**：自动生成.
