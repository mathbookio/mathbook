<meta-keywords>
    <meta itemprop="keywords" content={ keywords }/>
<script>
var self = this
this.keywords = ''

set(data){
    this.keywords = (data['keywords'] || []).join(',')
}

</script>
</meta-keywords>