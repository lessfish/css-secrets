# 条纹背景

## 难题

以前想要在网页中实现条纹图案，可能需要创建一个单独的位图文件，然后每次需要做些调整时，都用图像编辑器来修改它。现在我们可以直接在 CSS 中创建条纹图案

## 水平条纹

该法能实现水平条纹的核心原因是：如果多个色标具有相同的位置，它们会产生一个无限小的过渡区域

```html 
<body>
<style>
  body {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(#fb3 50%, #58a 50%);
    background-size: 100% 30px;
  }
</style>
</body>
```

以上 demo 中每个条纹的高度是 15px（它有两个渐变色，分别占据 50%，总共 30px）

为了避免每次改动数值时需要修改两个数字，我们可以再次从规范那里找到捷径：

> 如果某个色标的位置值比整个列表中在它之前的色标的位置值都要小，则该色标的位置值会被设置为它前面所有色标位置值的最大值

```html 
<body>
<style>
  body {
    background: linear-gradient(#fb3 50%, #58a 0);
    background-size: 100% 30px;
  }
</style>
</body>
```

## 垂直条纹

```html 
<body>
<style>
  body {
    background: linear-gradient(90deg, #fb3 50%, #58a 0);
    background-size: 30px 100%;
  }
</style>
</body>
```

与水平条纹实现的主要差别在于：我们需要在开头加上一个额外的参数来指定渐变的方向。在水平条纹的代码中，我们其实也可以加上这个参数，只不过它的默认值 to bottom 本来就跟我们的意图一致，所以可省略。最后，我们还需要把 background-size 的值颠倒一下

## 斜向条纹

```html 
<body>
<style>
  body {
    background: linear-gradient(45deg, #fb3 50%, #58a 0);
    background-size: 30px 30px;
  }
</style>
</body>
```

这个方法行不通。原因在于 **单个切片需要包含四条条纹**，而不是两条，只有这样才能做到无缝拼接

```html 
<body>
<style>
  body {
    background: linear-gradient(45deg, 
      #fb3 25%, #58a 0, #58a 50%, 
      #fb3 0, #fb3 75%, #58a 0);
    background-size: 30px 30px;
  }
</style>
</body>
```

但是这样的结果条纹很明显比之前的细，根据计算，**我们需要设置单个切片的宽度是之前的 \\(\sqrt2\\) 倍**

```html 
<body>
<style>
  body {
    background: linear-gradient(45deg, 
      #fb3 25%, #58a 0, #58a 50%, 
      #fb3 0, #fb3 75%, #58a 0);
    background-size: 42px 42px;
  }
</style>
</body>
```

## 更好的斜向条纹

我们将上面的代码修改角度，会发现条纹完全错乱了（try it!）

幸运的是，我们还有更好的方法来创建斜向条纹。linear-gradient() 和 radial-gradient() 还各有一个循环式的加强版：repeating-linear-gradient() 和 repeating-radial-gradient()。它们的工作方式和前两者类似，只有一点不同：**色标是无限循环重复的，直到填满整个背景**。

```html 
<body>
<style>
  body {
    background: repeating-linear-gradient(45deg,
      #fb3, #fb3 15px, #58a 0, #58a 30px);
  }
</style>
</body>
```

- 可以随意变换角度（try it!）
- 15px 是指渐变轴上度量到的距离，再也不用去乘以 \\(\sqrt2\\) 了
- 同理可以生成水平和垂直条纹（但是请注意，在这个方法中，无论条纹的角度如何，我们在创建双色条纹时都需要用到四个色标，这意味着，**我们最好用前面的方法来实现水平条纹或者垂直条纹，而用这种方法实现斜向条纹**）

## 灵活的同色系条纹

大多数情况下，我们想要的条纹图案并不是由差异极大的几种颜色组成的，**这些颜色往往属于同一色系，只是在明度方面有着轻微的差异**

```html 
<body>
<style>
  body {
    background: repeating-linear-gradient(30deg,
      #79b, #79b 15px, #58a 0, #58a 30px);
  }
</style>
</body>
```

条纹是由一个主色调（#58a）和它的浅色变体所组成的。但是，这两种颜色之间的关系在代码中并没有体现出来。如果我们想要改变这个条纹的主色调，甚至需要修改四处！

幸运的是，还有一种更好的方法：不再为每种条纹单独指定颜色，**而是把最深的颜色指定为背景色**，同时把半透明白色的条纹叠加在背景色之上来得到浅色条纹

```html 
<body>
<style>
  body {
    background: #58a;
    background-image: repeating-linear-gradient(30deg,
      hsla(0, 0%, 100%, .1),
      hsla(0, 0%, 100%, .1) 15px,
      transparent 0, transparent 30px);
  }
</style>
</body>
```
