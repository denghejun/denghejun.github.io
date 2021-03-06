### .NET Core is Coming
.NET Core自微软宣布.NET 开源以来，就在GitHub上积极的堆砌了好多的源码，感觉他们的工作热情相当的高！.NET Core是跨平台的，可以在大多数平台运行，意味着你可以在mac上使用.NET Core进行程序开发。它内置了多个组成部分，从开发.NET Core 应用、单元测试、直到部署都是全面支持的，且都提供以dotnet CLI的形式支持，意味着你可以轻松的用dotnet CLI完成新的.NET Core App开发、测试与部署。


### VS Code
我不太确定VS Code是否是在微软宣布开源之前就已经发布的产品，如果是，我觉得它是微软开源计划的重要部分。

越来越多的程序员们都开始倾向使用简单的可扩展的文本编辑器来编写代码，例如mac下自带的vim，只要进行稍加配置，就可以看到一个华丽无比且实用的编辑界面。我们知道vim的所有操作都是在terminal中进行的，所以我觉得它很酷，有像sublime、Notepad++一样的树形目录，可以完全通过terminal自由在目录、command line与code line之间相互切换，极大的提高工作的乐趣与效率，没有真正体验过，你就不知道它到底多么酷！

微软向来是做IDE的佼佼者，VisualStudio的强大不用多说了。微软的产品都很有特点，只要你一看到它就立刻猜到是微软开发的产品。VS Code就是一款纯文本编辑器，轻巧但可扩展，众多的插件可以让它变得更华丽、实用。

之所以在前边说VS Code可能是微软开源的重要部分，是因为VS Code内置的Terminal集成得相当好，因为新的dotnet CLI的到来必然会频繁的使用command line，那依照微软的觉悟势必什么东西都要自己做，所以才有了今天的VS Code，VS Code 默认的terminal在windows下是cmd.exe，可以配置为gitbash，视觉效果岂能是cmd.exe能比的？

当然，作为一款丰富文本编辑器，自然是支持众多程序设计语言的，比如nodejs，结合terminal用起来真是舒心多了。

### 创建.NET Core项目
为了抢先体验一份dotnet Core的一般开发流程，我决定亲自实验一番并将之记录下来。

* 在决定用dotnet core进行程序开发之前，需要按平台下载.NET Core SDK并安装:[https://www.microsoft.com/net/core#windows](https://www.microsoft.com/net/core)。
* 打开你最喜欢的terminal，我以git bash为例，分别执行以下命令：
创建好的目录结构是这样的
|dotnetcore-app
|_\contract
|_\implement
* 接着执行以下命令，创建2个.NET Core项目

### 项目依赖与编译
* 每个project.json即对应一个项目，且项目的名称就是project.json所在文件夹的名称，也可以在project.json文件中添加"name"属性以改变，但不推荐这么做，保持约定就好。
* 我们用VS Code来进行实际的代码编写，用VS Code打开目录dotnetcore-app
* 在contract项目下添加文件ICalculator.cs
* 修改implement项目下project.json文件，在dependencies下加入了对"contract"项目的依赖。
* 修改implement项目下project.json文件，去掉"type"："platform"，并添加runtimes节点，以便其build一个self-contain的可执行文件，这个可执行文件是根据配置"runtimes"决定的，.NET Core 的编译器Roslyn，会根据当前所在平台编译出对应平台的可执行文件，例如本例在windows下将会是一个exe文件。
* 在Implement项目下添加文件ConsoleCalculatorService.cs
这里用到了C#最新的语言特性，可以将简短的函数写成lambda表达式，更加的简洁漂亮了。
* 修改Implement下Program.cs如下
* 按下"ctrl + ~"，调出terminal窗口，cd到implement目录下执行以下命令，还原一些nuget package或本地项目依赖并编译；
* 编译好的程序目录如下
* 运行编译好的.NET Core程序有两种方式
1. 直接执行命令dotnet run，其实该命令是执行了dotnet run <TargetAssembly.dll>，该命令需要在安装了.NET Core的机器上才能执行
2. 直接运行编译好的对应平台的可执行文件

### 单元测试
* 在dotnetcore-app目录下依次创建文件夹test/contract-test,在test目录下执行dotnet new创建一个dotnet core 项目
* 修改project.json文件如下
* 在contract-test目录下添加文件DefaultCalculatorTest.cs
* 执行以下命令

### 发布部署
* 在implement项目目录下执行以下命令
* 发布目录
发布目录中包含了所有的依赖，包括.NET Core相关的程序集，所以你可以将程序部署在没有安装.NET Core的机器上或Docker中运行



