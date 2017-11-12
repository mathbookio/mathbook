<tutorial-sections>
<section class="section my-section-margin" each={ sections }>
    <div id={ fragment } class="title is-4">{ title }</div>
    <div class="content">{ text }</div>
  </section>
<script>
var that = this
this.sections = this.opts.sections || []

set(data){
  this.sections = data
}
</script>
</tutorial-sections>