---
title: "go:linkname的使用与原理"
published: 2025-08-26
tags: [Markdown, Blogging]
---

# go:linkname

最近在搞ospp时遇到了个难题，为分析runtime栈并与spanid和traceid通过label结合，我们需要用到pprof包的cpu_profiile，但是目前的对于全局cpuprofile增加label的唯一方法是通过ctx去传递，由于我们的agent需要混合编译到用户代码，这也就导致如果我们在agent设置全局ctx去传递label的话，用户就可能会对链路造成破坏（用户要增添自己的label也要去创建ctx,而这会覆盖😭）。目前有两种思路，第一种比较容易实现，我可以在toolkit去暴露一个函数让用户能够获取到当前的profile ctx，这样用户就可以在这个ctx的基础上去增添label，不会造成label丢失或混乱，但这样会对用户造成代码的侵入，且会增加用户的学习成本，并不是最优选择，所以就需要走第二条路，重写（或新增）pprof的部分方法，来实现不需要借助ctx传递就能设置label的方法。正当我借助ai分析源码时，一个不好的消息传来，最为关键的设置label的一个方法是为导出的😅。

我赞美AI，GPT真是个好东西啊，正当我以为我难道要去重写这一整套方法时，我适时的去向GPT诉了一下苦，您猜怎么着，GPT直接给了我一个大宝贝：go:linkname😭。

这是什么呢？以下是官方介绍：

```go
//go:linkname localname [importpath.name]  （//后要紧跟go哦，不要有空格）
```

这个特殊的指令的[作用域](https://zhida.zhihu.com/search?content_id=186045598&content_type=Article&match_order=1&q=作用域&zhida_source=entity)并不是紧跟的下一行代码，而是同一个包下生效。`//go:linkname`告诉 Go 的[编译器](https://zhida.zhihu.com/search?content_id=186045598&content_type=Article&match_order=1&q=编译器&zhida_source=entity)把本地的(私有)变量或者方法`localname`链接到指定的变量或者方法`importpath.name`。简单来说，`localname` `import.name`指向的变量或者方法是同一个。因为这个指令破坏了类型系统和包的模块化原则，只有在引入 `unsafe` 包的前提下才能使用这个指令。

哇，太酷了，他不仅能帮助你调用外部包未导出的方法，而且还能够用本地实现去替换外部实现🙌。但这很危险，因为你很难说某些方法不会随着go版本的改变或者某些基本方法别的外部实现没有调用，所以这个东西还是要慎用，一般只在 **调试工具 / profiling agent / instrumentation agent** 里会这么干。

现在来两个代码例子感受一下。

```go
package main

import _ "unsafe"

//go:linkname nanotime runtime.nanotime
func nanotime() int64

func main() {
    println(nanotime()) // 获取当前时间的纳秒数
}

```

第一个例子就是调用的runtime里的未导出的函数

```go
package main

import _ "unsafe"

//go:linkname nanotime runtime.nanotime
func nanotime() int64

func main() {
    println(nanotime()) // 获取当前时间的纳秒数
}

```

第二个例子通过未导出实现导出函数

```go
package outer

import (
	_ "github.com/he2121/demos/linkname_example/inner"	// 真实方法在 inner 包，必须引用这个编译器才能找到链接
)

func Hello()
```

```go
package inner

import (
	_ "unsafe"
)

//go:linkname hello github.com/he2121/demos/linkname_example/outer.Hello
func hello()  {
	println("hello")
}


```

```go
package main

import "github.com/he2121/demos/linkname_example/outer"

func main()  {
	outer.Hello()
	println(outer.A)
}
// output
// hello
// 100


```

参考资料：[Golang 的骚操作：go:linkname背景 在看源码时，一些源码方法没有方法体，难道说明这些方法为空？例如：ti - 掘金](https://juejin.cn/post/7037158518687793166)