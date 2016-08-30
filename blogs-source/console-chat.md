# Let us Chat In Console
#### 关于 Node.js
较为准确的解释，Node是一个javascript的运行时。所有基于Node的应用程序，你的Javascript代码将会由Node RunTime解释并执行。这也让JavaScript大量应用到后端系统成为了可能。

Node是基于事件驱动设计，但区别于大多数同样是事件驱动设计的系统而言，它是异步事件驱动，是非阻塞的；而大部分事件驱动设计都是阻塞的。所谓阻塞在Node中即是指在程序运行过程中遇到了non-JavaScript的操作，而Node进程不得不持续等待该操作的完成，从中不难看出，Node依然是不擅长CPU密集型的计算操作，这与大多数其他语言运行时一样，CPU密集型运算只能依赖你的程序的多线程设计和服务器硬件（如CPU数量）要求等。

异步事件驱动非常有利于开发出高性能的网络应用程序、静态资源服务器，这是异步事件所擅长的。幸好，对于我们现在大多数的系统来讲，都具备以下一些特征：
1.有大量的网络连接请求
2.几乎所有的请求需要频繁的DB、文件I/O操作
在Node中所有的I/O API读提供有异步的版本，且支持以callback的方式编写你的代码。相比于原始的Thread-Base的方式来讲，它是一个称职的设计，相反后者则是一个难以使用、不称职的设计。

#### 设计基于 Node 的 Chat Console
首先，Chat Server应该是一个C/S的架构。Server端监听某端口的网络请求，并负责转发数据；Client发起连接请求，并发送数据。为了程序的简单化，也为了熟悉Node中关于网络的原始部分，我决定引用'net'模块实现一个这样的demo：
1.server端只负责监听端口，接受连接。
2.将Server端创建的Socket分发到子进程中处理，子进程负责转发数据，保持各个cient的连接
3.client启动后自动连接到Server，并得到连接成功的提示，之后方可发送文本消息和图片
4.某一client发送的数据，将同时转发给所有"在线"的client
5.Client界面能够清晰的看到来自不同client发送的消息

#### Server
Server端的设计比较简洁，也是因为它负责的只是保持连接和转发数据。server端的程序结构如下：


./core/bootstrapper: 负责引导Server启动。
./core/child_process: 子进程负责处理到来的每个Socket。
./core/server-context: server启动时的上下文信息。
./server: server端启动模块。

#### Client 
Client端有以下几个主要职责：
1.支持发送两种形式的消息图片和文本
2.接收两种形式的消息，并缓存图片到本地，并显示图片（该功能不够完善）
3.控制用户输入流程和界面效果呈现
其程序结构如下：

./core/bootstrapper: 负责引导客户端初始化并连接到服务端
./core/client-processor: 创建新客户端模块
./core/message-processor: 消息发送和接收处理模块
./start: client端启动模块

#### 基于TCP/IP协议的数据格式
基于TCP/IP协议的数据是以Stream的形式发送的，是8位（bit）字节（byte）数组（ Uint8Array ），在Nodejs中Buffer既是它的另一实现，而Buffer或纯文本是底层网络发送消息的2种格式。
如果我们要申请分配一个无符号32位整数的Buffer（也就是4个字节（byte））：

当我们接收到这样一个字节数组时，可以采取以下方式读出其中的值：

将字符串转化为Buffer

申请固定长度的Buffer并初始化

将多个Buffer拼接成一个Buffer


分段读取Buffer中的各种数据

实际上当我们发送数据Buffer太大时，Client端会分多次接收数据，尤其是在那些保持长连接的Socket原生应用中。那么基于字节数据的使用我们可以定义出自己的一套消息协议[Type-Length-Value]，分别代表消息的类型、消息的长度（即Value的长度）、消息体。这三个元素全部为Buffer类型，将Buffer.concat([type,length,value])拼接到一起，作为一个格式化的封包发送出去。

这样，接收端在第一次收到消息时，将会首先得到type,length的部分，且这2部分各自都是定长的，比如Type长度为6，Length长度为4.那么我们可以分段读取这2个Buffer。然后根据Length的值可以计算在哪一次本批数据接收完成。然后把每次接收到的chunk给拼接起来，就是一段完整的Buffer，接下来就可以完全的读取Buffer中的内容了。

在本文描述的console chat中，即是使用了这种自定义消息协议。

#### 运行效果
启动server：

多Client发送消息：





