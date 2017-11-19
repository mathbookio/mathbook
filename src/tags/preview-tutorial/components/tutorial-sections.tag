<tutorial-sections>
<section class="section my-section-margin" each={ sections }>
    <div id={ fragment } class="title is-4">{ title }</div>
    <div id={'content_'+contentIndex} class="content preWrap">{ text }</div>
  </section>
<script>
var that = this
this.sections = this.opts.sections || []

this.on('mount', function(){
  that.renderContent()
})

renderContent(){
  for (var section of this.sections){
  const sectionId = 'content_'+section.contentIndex
  const sectionContentElement = document.getElementById(sectionId)
  try{
    renderMathInElement(sectionContentElement)
  }
  catch(err){
    console.log(err)
  }
  }
}

set(data){
  this.sections = data
  this.renderContent()
}
</script>
</tutorial-sections>