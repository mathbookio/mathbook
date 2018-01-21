<chart-modal>
  <div class="modal {is-active: isActive}">
    <div class="modal-background"></div>
  <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Insert Chart</p>
        <button class="delete" aria-label="close" onclick={ closeModal }></button>
      </header>
      <section class="modal-card-body">
          <div class="field is-grouped">
            <div class="control">
            <label class="label">Chart Type</label>
              <div class="select">
              <select id="chartTypeSelect">
                <option value="line">Line Chart</option>
              </select>
              </div>
            </div>
            <div class="control">
            <label class="label">Chart Size Ratio</label>
              <div class="select">
              <select id="chartRatioSizeSelect">
                <option value="ct-square">1</option>
                <option value="ct-minor-second">15:16</option>
                <option value="ct-major-second">8:9</option>
                <option value="ct-minor-third">5:6</option>
                <option value="ct-major-third">4:5</option>
                <option value="ct-perfect-fourth">3:4</option>
                <option value="ct-perfect-fifth">2:3</option>
                <option value="ct-minor-sixth">5:8</option>
                <option value="ct-golden-section">1:1.618</option>
                <option value="ct-major-sixth">3:5</option>
                <option value="ct-minor-seventh">9:16</option>
                <option value="ct-major-seventh">8:15</option>
                <option value="ct-octave">1:2</option>
                <option value="ct-major-tenth">2:5</option>
                <option value="ct-major-eleventh">3:8</option>
                <option value="ct-major-twelfth">1:3</option>
                <option value="ct-double-octave" selected>1:4</option>
              </select>
              </div>
            </div>
            <div class="control">
            <label class="label">X-Axis Low</label>
              <div class="select">
              <select id="xAxisLowSelect">
                <option value="null">Auto</option>
                <option value="0">0</option>
                <option value="-5">-5</option>
                <option value="-10">-10</option>
                <option value="-15">-15</option>
                <option value="-20">-20</option>
                <option value="-25">-25</option>
                <option value="-50">-50</option>
                <option value="-100">-100</option>
              </select>
              </div>
            </div>
            <div class="control">
            <label class="label">X-Axis High</label>
              <div class="select">
              <select id="xAxisHighSelect">
                <option value="null">Auto</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              </div>
            </div>
            <div class="control">
            <label class="label">Y-Axis Low</label>
              <div class="select">
              <select id="yAxisLowSelect">
                <option value="null">Auto</option>
                <option value="0">0</option>
                <option value="-5">-5</option>
                <option value="-10">-10</option>
                <option value="-15">-15</option>
                <option value="-20">-20</option>
                <option value="-25">-25</option>
                <option value="-50">-50</option>
                <option value="-100">-100</option>
              </select>
              </div>
            </div>
            <div class="control">
            <label class="label">Y-Axis High</label>
              <div class="select">
              <select id="yAxisHighSelect">
                <option value="null">Auto</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              </div>
            </div>
          </div>
        <div class="field is-grouped">
          <div class="control is-expanded">
          <label>Chart Series</label>
            <textarea id="chartSeries" class="textarea" placeholder="x;y pairs, ie. 1;2, 2;3, 3;4"></textarea>
            <p class="help">format: x;y => (1,3).  e.g. 1;2 => (1,2)
            <br/>
            Starting a new line (hitting enter) will add a new line plot
             </p>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
          <label class="checkbox">
            Show Points
            <input type="checkbox" checked="{ showPoints }" onclick={ toggleOption('showPoints') }/>
          </label>
          </div>
          <div class="control">
          <label class="checkbox">
            Show Lines
            <input type="checkbox"  checked="{ showLines }" onclick={ toggleOption('showLines') }/>
          </label>
          </div>
          <div class="control">
          <label class="checkbox">
            Show Area
            <input type="checkbox"  checked="{ showArea }" onclick={ toggleOption('showArea') }/>
          </label>
          </div>
        </div>
        <br/>
        <hr>
        <div class="field">
        <label>Preview</label>
          <div class="control">
            <div class="box">
              <div id="chartRendition" class="ct-chart { chartRatioSize }"></div>
            </div>
          </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button class="is-success button" onclick={ saveChart }>Save Chart</button>
        <button class="button" onclick={ closeModal }>Cancel</button>
      </footer>
    </div>
  </div>

<script>
  var self = this
  this.clientId = ''
  this.observable = this.opts.observable
  this.isActive = false
  this.chart
  this.chartRatioSize
  this.chartSeries = []
  this.showPoints = true
  this.showLines = true
  this.showArea = false
  this.xAxisLow
  this.xAxisHigh
  this.yAxisLow
  this.yAxisHigh


  this.on('mount', function() {
    this.initChartProperties()

    this.observable.on('showChartModal', function(clientId){
      self.isActive = true
      self.clientId = clientId
      self.update()
      self.generateChart()
    })

    $('#chartRatioSizeSelect').change(function(){
      const newRatioSize = this.value
      self.chartRatioSize = newRatioSize
      self.update()
      self.updateChart()
    })

    $('#xAxisLowSelect').change(function(){
      self.updateAxisValue('xAxisLow', this.value)
    })

    $('#xAxisHighSelect').change(function(){
      self.updateAxisValue('xAxisHigh', this.value)
    })

    $('#yAxisLowSelect').change(function(){
      self.updateAxisValue('yAxisLow', this.value)
    })

    $('#yAxisHighSelect').change(function(){
      self.updateAxisValue('yAxisHigh', this.value)
    })

    updateAxisValue(type, newValue){
      this[type] = newValue
      this.update()
      this.updateChart()
    }
    
    $('#chartSeries').on('input', function(e) {
      try{
        var data = $('#chartSeries').val().split('\n') || []
        const newSeries = []
        for(var i in data){
          var series = []
          const dataType = data[i].split(',')  || []
          for(var k in dataType){
            const point = dataType[k].trim()
            if (self.isValidInputPoint(point)){
              const splitPoint = point.split(';')
              const x = splitPoint[0]
              const y = splitPoint[1]
              series.push({ x: x, y: y })
            }
            else if (dataType[k] === "null"){
              series.push(null)
            }
          }
          newSeries.push(series)
          series = []
        }
        self.chartSeries = newSeries
        self.updateChart()
      }
      catch(err){
        console.log('error chart series input change', err)
      }
    })

  })

  isValidInputPoint(point){
    // point should follow the following format: x;y => 1;3
    // decimals are allowed
    return /^(\-)?\d+(?:\.\d+)?[\;](\-)?\d+(?:\.\d+)?$/.test(point)
  }

  toggleOption(type){
    // type can be one of 'showPoints', 'showLines', or 'showArea'
    return function toggleType(){
      self[type] = !self[type]
      self.updateChart()
    }

  }

  initChartProperties(){
    this.chartType = $('#chartTypeSelect').val()
    this.chartRatioSize = $('#chartRatioSizeSelect option:selected').val()

    this.xAxisLow = $('#xAxisLowSelect option:selected').val()
    this.xAxisHigh = $('#xAxisHighSelect option:selected').val()

    this.yAxisLow = $('#yAxisLowSelect option:selected').val()
    this.yAxisHigh = $('#yAxisHighSelect option:selected').val()
  }

  saveChart(){
    const ratio = this.chartRatioSize
    const data = { series: self.chartSeries}
    const options = this.generateOptions()
    this.observable.trigger('savedChart', self.clientId, ratio, data, options)
    this.close()
  }

  generateChart(){
    const selector = $('#chartRendition').get(0)
    const data = { series: self.chartSeries}
    const options = this.generateOptions()
    this.chart = createLineChart(selector, data, options)
  }

  updateChart(){
    const data = { series: self.chartSeries}
    const options = this.generateOptions()
    this.chart = updateLineChart(this.chart, data, options)
  }

  generateOptions(){
    const options = {
      axisX: {
        high: self.xAxisHigh !== "null" ? self.xAxisHigh : undefined,
        low: self.xAxisLow !== "null" ? self.xAxisLow : undefined,
        onlyInteger: true
      },
      axisY: {
        high: self.yAxisHigh !== "null" ? self.yAxisHigh : undefined,
        low: self.yAxisLow !== "null" ? self.yAxisLow : undefined,
        onlyInteger: true
      },
      showPoint: self.showPoints, 
      showLine: self.showLines, 
      showArea: self.showArea 
    }

    return options
  }

  cleanUpFields(){
    $('#chartSeries').val('')
    $('#chartRendition').empty()
    $('#xAxisLowSelect').val("null")
    $('#xAxisHighSelect').val("null")
    $('#yAxisLowSelect').val("null")
    $('#yAxisHighSelect').val("null")
    $('#chartRatioSizeSelect').val("ct-double-octave")
    this.chartSeries = []
    this.showPoints = true
    this.showLines = true
    this.showArea = false
    this.chart = undefined
    this.xAxisLow = "null"
    this.xAxisHigh = "null"
    this.yAxisLow = "null"
    this.yAxisHigh = "null"
    console.log('finished cleaning up fields')
  }

  closeModal(){
    const showPrompt = true
    this.close(showPrompt)
  }

  close(showPrompt){
    if (showPrompt){
      var confirmClose = confirm('Are you sure you want to close this chart editor view ? Any unsaved changes will be discarded.')
      if (confirmClose){
        this.isActive = false
      }
    }
    else{
      this.isActive = false
    }
    this.cleanUpFields()
}

/* 

{
axisX: {
    // The offset of the labels to the chart area
    offset: 30,
    // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
    position: 'end',
    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
    labelOffset: {
      x: -20,
      y: 0
    },
    // If labels should be shown or not
    showLabel: true,
    // If the axis grid should be drawn or not
    showGrid: true,
    // Interpolation function that allows you to intercept the value from the axis label
    labelInterpolationFnc: Chartist.noop,
    // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
    type: undefined
  },
  // Options for Y-Axis
  axisY: {
    // The offset of the labels to the chart area
    offset: 40,
    // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
    position: 'start',
    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
    labelOffset: {
      x: 0,
      y: 0
    },
    // If labels should be shown or not
    showLabel: true,
    // If the axis grid should be drawn or not
    showGrid: true,
    // Interpolation function that allows you to intercept the value from the axis label
    labelInterpolationFnc: Chartist.noop,
    // Set the axis type to be used to project values on this axis. If not defined, Chartist.AutoScaleAxis will be used for the Y-Axis, where the high and low options will be set to the global high and low options. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
    type: undefined,
    // This value specifies the minimum height in pixel of the scale steps
    scaleMinSpace: 20,
    // Use only integer values (whole numbers) for the scale steps
    onlyInteger: false
  },
  // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
  width: undefined,
  // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
  height: undefined,
  // If the line should be drawn or not
  showLine: true,
  // If dots should be drawn or not
  showPoint: true,
  // If the line chart should draw an area
  showArea: false,
  // The base for the area chart that will be used to close the area shape (is normally 0)
  areaBase: 0,
  // Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.
  lineSmooth: true,
  // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
  low: undefined,
  // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
  high: undefined,
  // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
  chartPadding: {
    top: 15,
    right: 15,
    bottom: 5,
    left: 10
  },
  // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
  fullWidth: true,
  // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
  reverseData: false,
  // Override the class names that get used to generate the SVG structure of the chart
  classNames: {
    chart: 'ct-chart-line',
    label: 'ct-label',
    labelGroup: 'ct-labels',
    series: 'ct-series',
    line: 'ct-line',
    point: 'ct-point',
    area: 'ct-area',
    grid: 'ct-grid',
    gridGroup: 'ct-grids',
    vertical: 'ct-vertical',
    horizontal: 'ct-horizontal',
    start: 'ct-start',
    end: 'ct-end'
  }
};

*/

</script>
</chart-modal>