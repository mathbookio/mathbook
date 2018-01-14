<chart-modal>
  <div class="modal {is-active: isActive}">
    <div class="modal-background"></div>
  <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Insert Chart</p>
        <button class="delete" aria-label="close" onclick={ close }></button>
      </header>
      <section class="modal-card-body">
          <div class="field">
            <label class="label">Chart Type</label>
            <div class="control">
              <div class="select">
              <select id="chartTypeSelect">
                <option value="line">Line Chart</option>
              </select>
              </div>
            </div>
          </div>
        <div class="field">
          <label>Chart Labels</label>
          <div class="control">
            <textarea id="chartLabels" class="textarea json" placeholder="x-axis values"></textarea>
          </div>
        </div>
        <div class="field">
          <label>Chart Series</label>
          <div class="control">
            <textarea id="chartSeries" class="textarea json" placeholder="y-axis values"></textarea>
          </div>
        </div>
        <!--  <div class="field">
          <label>Chart Options</label>
          <div class="control">
            <textarea id="chartOptions" class="textarea json" placeholder="chart options"></textarea>
          </div>
        </div>  -->
        <br/>
        <hr>
        <div class="field">
        <label>Preview</label>
          <div class="control">
            <div class="box">
              <div class="ct-chart ct-square"></div>
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
  this.chartData = { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], series: [ [5, 4, 3, 7, 5, 10] ] }
  this.chartOptions =  {}

  this.on('mount', function() {
    this.chartType = $('#chartTypeSelect').val(); 
    this.observable.on('showChartModal', function(){
      self.isActive = true
      this.chart = new Chartist.Line('.ct-chart', self.chartData, self.chartOptions);
    })
    console.log('canvas', self.canvas)
    console.log('this.chart', this.chart)

    $('#chartLabels').on('input', function(e) {
      var data = $('#chartLabels').val()
      console.log('chart data input', data)
      self.chartData['labels'] = data
    })
    
    $('#chartSeries').on('input', function(e) {
      var data = $('#chartSeries').val()
      console.log('chart data input', data)
      self.chartData['series'] = data
    })

    $('#chartOptions').on('input', function(e) {
      var data = $('#chartOptions').val()
      try{
        console.log('chart options input', data)
        var chartOptions = JSON.parse(data)
        self.chart.config.options = chartOptions
        self.chart.render()
      }
      catch(err){
        console.log('failed to parse chart options or update chart', err)
      }
    })

  })

  saveChart(){
    console.log('saveChart::chartCanvas', $('#chartBox').html())
    this.observable.trigger('savedChart', this.chartData, this.chartOptions)
    this.close()
  }

  close(){
    this.isActive = false
  }


</script>
</chart-modal>