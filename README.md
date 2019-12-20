## 关于程序index.js的说明

还有两部分待实现：

- 时间序列图。对应seriesInit和drawSeries函数。
- 显示详细的论文信息。对应infoInit和drawInfo函数。

一些容易出问题的点：

- 尽量使用局部变量（用let定义，var定义的是全局变量），不然每个人写的函数变量可能冲突。
- 需要用的辅助函数尽量在drawInfo和drawSeries内部定义，不然每个人写的函数名也可能冲突。
- drawSeries和drawInfo会被多次调用，不要直接append元素（不然每次调用都append一次，会导致重叠）。不变的元素（如坐标轴）可以在init的时候append。会变的元素（如折线）使用d3的join（enter/exit）函数。

## 相关文件的说明

- client/
  - css/：样式文件
  - data/
    - clustering.json：聚类的信息，包含年份（year），关键词（keywords，每年取出50个出现频率最高的，之后汇总、去重后得到200多个），节点（nodes，每年的50个关键词，包括关键词name，在当年的出现次数cnt，出现次数占比val，聚类后所属的组group），连边（edges，50个关键词两两共现的关系，包括两个关键词key1、key2，两个关键词的序号source、target，共现次数cnt，共现系数val）
    - dataSetWithKeyWords.json：每篇文字的信息，包括title、year、authors、abstract、ref、keywords（摘要中出现次数最高的前7个单词）
  - js/
    - index.js：需要完善的文件
    - nodeLink.js：力导向图方案（废弃）
    - 其他js库文件
  - index.html：html文件
  - README.md