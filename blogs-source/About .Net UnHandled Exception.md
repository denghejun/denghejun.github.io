About .Net System.Threading.Tasks UnHandled Exception

最初对线程异常的盲点
不得惭愧的说，之前我一直认为多线程中线程的未处理异常对程序 Main Thread 毫无影响。我觉得我之所以有这样的认识有以下几个原因（不是找借口哈）：
1.不同版本的.NET Framework 对线程未处理异常的默认表现不一致
2.同一.NET Framewoek版本下，不同多线程API对未处理异常的表现不一致
如果不去究其原因，就只能想微软常说的那样“it was not a problem, that was by design.”, 但确实，有些东西预先就是这么设计的。

常见异步处理代码片段
1. it works Bad！

2. it works Good！


可见，并不是所有的异步线程抛出的未处理异常都会使应用程序直接崩掉，但为了统一，我建议一个原则：
线程异常通常由自己处理，而不应该放任不管。

但如果你以为记住这些API的表现就行了，在以后的使用中就不会有什么问题了，那就太天真了，举个栗子：上边那些works good的API在不同版本.NET Framework下任有不同的表现。

微软对此有几个特殊的“By Design”，对于那些由Task.Factory.StartNew等相关方式创建的线程所抛出的UnhandledException，需要特别注意：
（1）	在.NET 4.0 fromwork中，默认会终止应用程序
（2）	在.NET 4.5或更高版本中，默认不会终止应用程序，程序将会正常运行，但也可以通过如下配置还原到.NET 4.0的默认行为：
<configuration>
  <runtime>
       <ThrowUnobservedTaskExceptions enabled="true"/>
  </runtime>
</configuration>
（3）	即使程序Build Target .Net Version是4.0的，如果安装有高于4.0版本的framework，但程序依然会运行在高版本的framework上，所以程序依然正常运行
所以，在那些只装有.NET framework 4.0的机器上，我们的WCF Server在GC回收时，若发现有未处理的线程异常，则会终止应用程序。

以上，我都全部验证过，的确如此，之前一直没注意这个，知道有一天用户抛给我一个bug.但如果.NET Framework一直保持Update，那么，这将不会是一个问题。

后记
所以，只要涉及到多线程，就会增加程序的复杂度，就算你做好了多线程资源同步等等常规性的问题，总避免不了出现一些隐式的问题，直到发现它那天为止。
但也不是无法完全避免，比如只要涉及到有新的线程开销了，是否需要特别关注，线程内部的异常要怎么处理，如果做好了这样的“内聚”工作，相信线程间、模块间的依赖也就消失了，那么，自然问题也就少了。