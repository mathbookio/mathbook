<chart-modal>
  <div class="modal {is-active: isActive}">
    <div class="modal-background"></div>
  <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Insert Chart</p>
        <button class="delete" aria-label="close" onclick={ close }></button>
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
                <option value="ct-double-octave">1:4</option>
              </select>
              </div>
            </div>
          </div>
        <div class="field is-grouped">
          <div class="control is-expanded">
          <label>Chart Labels</label>
            <textarea id="chartLabels" class="textarea json" placeholder="x-axis values"></textarea>
          </div>
          <div class="control is-expanded">
          <label>Chart Series</label>
            <textarea id="chartSeries" class="textarea json" placeholder="y-axis values"></textarea>
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
        <button class="button" onclick={ close }>Cancel</button>
      </footer>
    </div>
  </div>

<script>
  var self = this
  this.observable = this.opts.observable
  this.isActive = false
  this.chart
  this.chartRatioSize = $('#chartRatioSizeSelect option:selected').text()
  this.chartLabels = []
  this.chartSeries = []
  this.showPoints = true
  this.showLines = true
  this.showArea = false

  this.on('mount', function() {
    this.chartType = $('#chartTypeSelect').val(); 
    this.observable.on('showChartModal', function(){
      self.isActive = true
      self.generateChart()
    })

    $('#chartRatioSizeSelect').change(function(){
      const newRatioSize = this.value
      self.chartRatioSize = newRatioSize
      self.update()
      self.generateChart()
    })

    $('#chartLabels').on('input', function(e) {
      try{
        var data = $('#chartLabels').val().split(',')
        self.chartLabels = data
        self.generateChart()
      }
      catch(err){
        console.log('error chart labels input change', err)
      }
    })
    


    $('#chartSeries').on('input', function(e) {
      try{
        var data = $('#chartSeries').val().split('\n') || []
        const newSeries = []
        for(var i in data){
          newSeries.push(data[i].split(','))
        }
        self.chartSeries = newSeries
        self.generateChart()
      }
      catch(err){
        console.log('error chart series input change', err)
      }
    })

  })

  toggleOption(type){
    // type can be one of 'showPoints', 'showLines', or 'showArea'
    return function toggleType(){
      self[type] = !self[type]
      self.generateChart()
    }

  }

  saveChart(){
    const ratio = this.chartRatioSize
    const data = { labels: self.chartLabels, series: self.chartSeries}
    const options = { showPoint: self.showPoints, showLine: self.showLines, showArea: self.showArea }
    this.observable.trigger('savedChart', ratio, data, options)
    this.close()
  }

  generateChart(chartData, chartOptions){
    const selector = $('#chartRendition').get(0)
    const data = { labels: self.chartLabels, series: self.chartSeries}
    const options = { showPoint: self.showPoints, showLine: self.showLines, showArea: self.showArea }
    this.chart = new Chartist.Line(selector, data, options)
  }

  close(){
    this.isActive = false
  }


</script>
</chart-modal>