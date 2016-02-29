# react-slider
A ReactJS slider component that allows for new styles to be applied during the slide

![Example sliders](https://cloud.githubusercontent.com/assets/1519443/13396256/85abf75c-deeb-11e5-923e-553be8363e00.gif)

# How to use

Create a map of upper-bound thresholds to class names:
```
   const sliderAlternatingClassMap = {
      30: 'slideHandle1',
      40: 'slideHandle2',
      50: 'slideHandle3',
      60: 'slideHandle4',
      80: 'slideHandle5',
      100: 'slideHandle6',
    };
```
Pass the class map to the `Slider` component:

```
<Slider start={ 20 } min={ 0 } max={ 100 } onEmitValue={ (x) => console.log('New Value ', x) } slidingClassMap={ sliderAlternatingClassMap } />
```

