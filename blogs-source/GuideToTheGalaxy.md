## ThoughtWorks
本文将一起探讨来自于`ThoughtWorks`的一道`Homework`。并尝试深入什么是软件工程、设计。软件开发远没有那么简单。

在这之前，我们谈谈`ThoughtWorks`吧。在即将前往`ThoughtWorks`之前，我当然去了解过。在普通人眼中，常常谓之为`高级外包公司`！事实就是这样，`ThoughtWorks`是外包服务提供商，同时也是一家专业的IT咨询公司，还在公益事业有所贡献。实际上，`ThoughtWorks`之余我而言，诱惑到我的有以下几点：
* 它教会你如何做软件工程，而不仅仅是讨论某行代码该如何更优雅
* 它开放式、轻松的工作环境，往往是不需要上下班打卡的；因为这样对员工是激励作用，而不是约束，IT行业更是如此
* 高付出高回报；且还有全新的Mac标配
* [Martin Fowler](https://zh.wikipedia.org/wiki/%E9%A9%AC%E4%B8%81%C2%B7%E7%A6%8F%E5%8B%92)

总之，在我眼中总有那么几家IT公司是必须要去看看的，而你选择它的理由往往就那么简单！

## Merchant's Guide To The Galaxy
我承认我并不是很喜欢对一个问题进行反复的描述，那么我们就简单来看下`Merchant's Guide To The Galaxy(商人银河系指南)`原始需求的一小部分：
```
A sample input file would be like this:

glob is I
prok is V
pish is X
tegj is L
glob glob Silver is 34 Credits
glob prok Gold is 57800 Credits
pish pish Iron is 3910 Credits
how much is pish tegj glob glob ?
how many Credits is glob prok Silver ?
how many Credits is glob prok Gold ?
how many Credits is glob prok Iron ?
how much wood could a woodchuck chuck if a woodchuck could chuck= wood ?

Corresponding output to this would be as given below :

pish tegj glob glob is 42
glob prok Silver is 68 Credits
glob prok Gold is 57800 Credits
glob prok Iron is 782 Credits
I have no idea what you are talking about

```
实际上，原文远不止这么多，大概我贴出的部分是其`1/5`，为了不让原文占据大量篇幅，我想我只能缩减到这么多了，这是一个输入、输出的样例；其中输入部分有一点特殊要求：
* 必须提供支持从文件输入的接口 

在我们开始讨论它之前，我想你已确保你全部理解了`Sample`中的每一行描述，因为我并不打算再为你翻译一遍了，如果你也很懒，也可以`Google it`。
## 这是什么
一开始，我也是这么认为的：
* 是一个控制台程序
* 需要提供从文件输入
* 有许多稍显复杂的字符串处理，可能会用到正则表达式
* 涉及到罗马数字(I、V、X、L、C、D、M)与十进制的转换和计算

显然，一开始能知道的差不多就是这些了；可以预想到实现较复杂的部分在于字符串的处理、罗马数字的转换与计算以及这两者之间的衔接，即如何在做好字符串处理的同时，优雅的计算转换，这无疑成了本需求的关键部分。

* 字符串处理是一个常规的编程问题，它应该是一种纯粹的对数据的操作部分，不应该镶嵌在计算、转换这样的操作中；
* 罗马数字应是一个专业的领域系统，需要提供计算和转换的标准接口，应该将它设计成一种公共资源，甚至于本需求无关；
* 支持从文件输入和控制台输入，实际上为了接口的统一，理论上应该把从控制台输入的数据也缓存到临时文件，这样系统的入口单一，接口的调用方会觉得更加舒适。

认清问题本质，并在编码前就理清思路往往事半功倍，并会增强编码自信。

## 问题本质与抉择
针对以上三个重要部分，我们需要分开来对待，各个击破。
###### 用户指令识别、提取与存储
显然我们面临的难题是如何从`乱七八糟`的用户输入中识别、提取有用的信息，类似于数据挖掘，当然这个概念对于此还是太大了。

面对复杂多样的数据信息时，`分类`是尝试解决复杂度、大规模的有效解决方案，这在搜索引擎等大数据解决方案中都有事实证明，那么我们就不得不先来分解出有几种类型的输入，暂且称之为用户指令类型:
* `glob is I`: 这是一种对罗马数字进行别名的约定描述输入；理解为从现在开始，`I`的别名是`glob`；
* `glob glob Silver is 34 Credits`: 这是一种对商品单价的隐含描述；理解为`glob(I) glob(I)`个`Silver`(银子)共`34`金币，那么`Silver`的单价也就告诉你了：一个`Silver`是`34/glob(I) glob(I)`金币。
* `how much is pish tegj glob glob ?`:这是一种纯粹的用别名的方式询问罗马数字组合后与十进制值的转换描述；
* `how many Credits is glob prok Silver ?`:这是一种询问商品数量与总价的计算描述；理解为`glob prok`个`Silver`多少金币；
* `how much wood could a woodchuck chuck if a woodchuck could chuck= wood ?`:这是一种异常输入，属于程序处理范围之外的输入；实际上不属于这之上所有情况的目前来讲都是异常输入；

目前，输入类型总共有以上`5`类。但不排除后续用户增加新的输入类型，所以在设计上是不允许遗漏你所能判有变化的部分，也就意味着你必须考虑以后新增输入类型时，你的程序会如何修改更优雅。

实现这`5`类指令数据的识别并不是本文的关键，你可以用你觉得合适的方式，正则表达式或简单的`StartWith?`、`Contains?`等等（实际上由于我对正则的薄弱，我选择了后者），所以，你并不需要为对字符串处理而感到恐惧，有时候我经常能感觉到,`But It's NOT Today!`，所以，让我们尽可能的放松些，这仅仅是一个10分钟闲暇时的咖啡讨论。

而必须要给出的建议是，请考虑好每条数据识别成功并处理后，你的数据如何存储以待后续输入的使用；直接的说：
* 罗马数字的别名识别后，如何存储一边后续的输入使用？
* 商品单价信息识别后，单价如何保存，后续输入如何利用？

我的建议无非就两点
* 临时文件或DB
* 内存

我选择的是内存，因为它够快、够简单；除此之外，另一个重要的原因是这是一个`指南`系统，对于用户的每次输入都是`临时的`没有必要写入文件或DB，因为那样是对用户存储空间的浪费，就算你每次系统退出时清理也是一样。而内存就不一样了，只有运行时才会分配，没有额外空间，系统关闭，内存自动就释放了，没有繁复`IO`操作。

若要保存在内存中，那么请将各个类型的输入设计成一个一个的小指令系统，各自对指令数据进行识别、计算和保存的处理。并提供对外API支援。


###### 罗马数字资源系统
让我们尽可能的简单化地考虑这个问题，它与用户指令根本无关，甚至它本身并不该是一个问题如果有标准的国际支持的话。好吧，没有办法，我们得自己来造这个汽车轮子。我希望看到的罗马数字资源是这样的
* 我能单独的、简单访问到所有罗马数字，并得到它的十进制值
* 每个罗马数字必须有一个额外的别名属性，一边使用方可以以更友好、可读的方式来使用它
* 罗马数字组成一个串时，必须满足罗马数字组合的规则（`Google it`）
* 我能轻易的构造一个罗马数字串，并获得它所代表的十进制值

你实现了已上几点也就基本够用了，估且就让它成为所谓的罗马数字资源吧！



## 如何深度设计使其满足专业软件的低耦合、可扩展、优雅
本段落是大量描写如何基于上边小节的描述并工程实现的部分。有许多代码的部分，希望你能敏锐的察觉我所想体现的是什么。
首先，整体工程的结构是这样的
```
*** 控制台 ***
GuideConsole(.exe)
|_GuideMenus
|_GuideMenus/ExitMenu.cs
|_GuideMenus/InputDataFromConsoleMenu.cs
|_GuideMenus/InputDataFromFileMenu.cs

*** 银河系指南系统 ***
GuideToTheGalaxy(.dll)
|_GalaxyGuider.cs
|_Commands ## 指令系统
|_Commands/AliasCommand.cs
|_Commands/UnitPriceCommand.cs
|_Commands/HowManyCommand.cs
|_Commands/HowMuchCommand.cs
|_Commands/UnknownCommand.cs
|_Strategies ## 指令策略系统
|_Strategies/AliasCommandStrategy.cs
|_Strategies/UnitPriceCommandStrategy.cs
|_Strategies/HowManyCommandStrategy.cs
|_Strategies/HowMuchCommandStrategy.cs
|_Strategies/UnknownCommandStrategy.cs
|_Core ## 对指令系统和策略系统提供核心抽象支撑
|_Core/Command.cs
|_Core/CommandDirective.cs
|_Core/DirectiveProxy.cs
|_Core/ICommandStrategy.cs

*** 罗马数字资源系统 ***
RomanNumerals(.dll)
|_RomanCalculator.cs
|_RomanNumber.cs
|_SymbolEnum.cs

*** 基于 NUnit 单元测试 ***
GuideToTheGalaxy.Tests(.exe)
|_...

```
正如已上描述的那样，我们在此只来看看`银河系指南系统`部分的设计。

首先为了区分出指令数据和行为，我们进行以下约定：
* 指令（Directive）：代指用户的输入，进行解析用户输入并缓存，是纯粹的数据部分；
* 命令（Command）：代指操作指令（数据）的行动者；将何种指令进行何种处理并输出是其本质；

指令和命令之间需要双向适配，即何种指令只能由何种命令处理，反之亦然。所以我们分别定义出以下指令（CommandDirective）和命令（Command）的抽象:
```
    public class CommandDirective
    {
        public CommandDirective(string content)
        {
            this.Content = content;
            this.Validate(content);
        }

        public string Content { get; private set; }

        protected virtual void Validate(string content)
        {

        }
    }

    public abstract class CommandDirective<TCommand> : CommandDirective where TCommand : Command
    {
        public CommandDirective(string content) : base(content)
        {
        }

        public abstract TCommand Command { get; }
    }
```
```
   public abstract class Command
    {
        public abstract object Execute();
    }

    public abstract class Command<TDirective> : Command where TDirective : CommandDirective
    {
        protected TDirective _directive;

        public Command(TDirective directive)
        {
            this._directive = directive;
        }
    }
```
请总是为你的抽象提供一个工厂去对外使用，这样有几个好处：
* 创建对象与对象本身、对象本身与使用对象本身都是分离的
* 工厂有利于对对象创建情况统一监控

比如这里，客户端始终使用从CommandDirective派生出来的具象指令，那么我为抽象指令提供一个简单工厂进行统一创建：
```
 public static class DirectiveProxy<TDirective> where TDirective : CommandDirective
    {
        public static TDirective Create(string content)
        {
            return (TDirective)Activator.CreateInstance(typeof(TDirective), new object[] { content });
        }
    }
```
那么，使用起来就会是这个样子
```
 DirectiveProxy<AliasCommandDirective>.Create(content).Command.Execute()?.ToString();
```
接下来就是体力活了，我们需要完全按照我们的抽象定义出具体的Directive（数据）和Command（行为）,下面是一个`AliasCommandDirective`和`AliasCommand`的快照：
```
  public class AliasCommand : Command<AliasCommandDirective>
    {
        public AliasCommand(AliasCommandDirective directive) : base(directive)
        {
        }

        protected static readonly List<RomanNumber> AliasNumbers = new List<RomanNumber>();

        public override object Execute()
        {
            var existsRomanNumber = AliasCommand.AliasNumbers.FirstOrDefault(o => o.Symbol.Equals(this._directive.Number.Symbol));
            if (existsRomanNumber != null)
            {
                existsRomanNumber.Alias = this._directive.Number.Alias;
            }
            else
            {
                AliasCommand.AliasNumbers.Add(this._directive.Number);
            }

            return this._directive.Number;
        }

        public static void Clear()
        {
            AliasCommand.AliasNumbers.Clear();
        }

        public static RomanNumber GetRomanNumberByAlias(string alias)
        {
            return AliasCommand.AliasNumbers.FirstOrDefault(o => o.Alias.Equals(alias?.Trim(), StringComparison.InvariantCultureIgnoreCase));
        }

        public static List<RomanNumber> GetAllRomainNumbers()
        {
            return AliasNumbers;
        }
    }

    public class AliasCommandDirective : CommandDirective<AliasCommand>
    {
        public AliasCommandDirective(string content) :
        base(content)
        {
        }

        public string Alias
        {
            get
            {
                return this.Content.Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries)[0];
            }
        }

        public string Symbol
        {
            get
            {
                return this.Content.Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries)[2]?.ToUpper().Trim();
            }
        }

        public RomanNumber Number
        {
            get
            {
                var roman = RomanNumber.Create(this.Symbol);
                if (roman != null)
                {
                    roman.Alias = this.Alias;
                }

                return roman;
            }
        }

        public override AliasCommand Command
        {
            get
            {
                return new AliasCommand(this);
            }
        }
    }
```

事实上，当我们拥有了大量成型的指令后，应该在何时何地调用正确的指令处理用户输入呢？显然，这是一个策略问题。于是，我们针对这种场景设计一个标准的策略接口ICommandStrategy：
```
 public interface ICommandStrategy
 {
    bool CanExecute(string content);
    GuideResponse Execute(string content);
 }
```
接下来，我们要为每个Directive实现自己的策略，以下是一个`AliasCommandStrategy`的范例
```
 public class AliasCommandStrategy : ICommandStrategy
    {
        public bool CanExecute(string content)
        {
            var splitedDesc = content.Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries).ToList();
            return splitedDesc.Count == 3 && RomanNumber.RomanNumbers.Contains(splitedDesc.Last());
        }

        public GuideResponse Execute(string content)
        {
            DirectiveProxy<AliasCommandDirective>.Create(content).Command.Execute()?.ToString();
            return GuideResponse.Empty;
        }
    }
```
当你实现所有的策略时，无疑离成功只差一步了，客户端如何使用这些策略。很简单，需要提供给客户端一个策略集合，客户端以此将每条用户输入传递给每个策略，当有策略`CanExecute`返回`true`时，随即调用`Command.Execute`处理之。
```
  private static GuideResponse Solve(string content)
        {
            try
            {
                return CommandStrategies.FirstOrDefault(o => o.CanExecute(content))?.Execute(content) ?? GuideResponse.Unknown;
            }
            catch
            {
                return GuideResponse.Unknown;
            }
        }
```
呼...结束了，关于临时文件存储等客户端部分更多请点击View On GitHub 参见源码。
## 完善客户端用户体验
永远不要忘了，最不关心你怎么实现的是用户，与用户有直接影响的是客户端体验。这是一个工程性的问题，可以很庞大，也可以很渺小，主要取决于你的客户对象。

给这本`银河系指南`设计一个好的`目录`取悦客户绝不是件糟糕的事。
```
--------------------- Guide To Galaxy ----------------------
1. Input Data From File
2. Input Data From Console
3. Exit

-------------------------------------------------------------
|2
```
```
Please input data directly in console, and Press 'Enter' twice to execute.
-------------------------------------------------------------
glob is I
prok is V
pish is X
tegj is L
glob glob Silver is 34 Credits
glob prok Gold is 57800 Credits
pish pish Iron is 3910 Credits
how much is pish tegj glob glob ?
how many Credits is glob prok Silver ?
how many Credits is glob prok Gold ?
how many Credits is glob prok Iron ?
how much wood could a woodchuck chuck if a woodchuck could chuck wood ?

pish tegj glob glob is 42
glob prok Silver is 68 Credits
glob prok Gold is 57800 Credits
glob prok Iron is 782.0 Credits
I have no idea what you are talking about

Press any key to continue ...
.............................................................
|
```

```
Are you sure to exit [y/n] ?
-------------------------------------------------------------
y|
```
## 总是将代码放到安全的地方
建议总是把代码`push`到任何你喜欢的任何方式托管的`Repository`，因为我总觉得把代码存储到我单机的电脑磁盘中会不保险，也不便于回顾。