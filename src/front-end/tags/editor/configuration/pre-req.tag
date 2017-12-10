<pre-req>
  <div class="field">
    <label class="label">Prerequisite Topics (max. 4)</label>
  </div>
  <div class="field is-grouped" id="preReq">
    <div class="control is-expanded">
      <input class="input {is-danger: invalidPreReqTitle}" id="preReqTitle" type='text' placeholder='Topic Title'  ref="preReqTitle" />
       <p show={ invalidPreReqTitle } class="help is-danger">Title can't be empty</p>
       <p show={ tooManyPreReqs } class="help is-danger">Max. number of Pre-Requisites reached (4)</p>
    </div>
    <div class="control is-expanded">
      <input class="input {is-danger: invalidPreReqUrl}" id="preReqUrl" type='text' placeholder='Topic Url' ref="preReqUrl" />
       <p show={ invalidPreReqUrl } class="help is-danger">Invalid Url</p>
    </div>
    <div class="control">
      <a class="button is-success" onClick={ addPreReq }>Add</a>
    </div>
  </div>
  <div each={ preRequisites } class="field">
    <div class="control">
      <a class="tag is-danger" onClick={ removePreReq }> REMOVE </a>
      <span>{ title } - { url }</span>
    </div>
  </div>
  <script>
    this.preRequisites = []
    this.invalidPreReqTitle = false // default
    this.invalidPreReqUrl = false // we don't want to show red input fields by default
    this.tooManyPreReqs = false
    addPreReq() {
      if (this.preRequisites.length >= 4){
        this.tooManyPreReqs = true
        this.emptyFields()
        return
      }
      var preReq = {
        title: this.refs.preReqTitle.value,
        url: this.refs.preReqUrl.value
      }
      console.log(preReq)
      this.tooManyPreReqs = false
      this.invalidPreReqTitle = isPreReqTitleInvalid(preReq.title)
      this.invalidPreReqUrl = isPreReqUrlInvalid(preReq.url)
      if (!this.invalidPreReqTitle && !this.invalidPreReqUrl) {
        this.preRequisites.push(preReq)
        console.log("PREREQ IS VALID")
        this.emptyFields()
        return
      }
        console.log("PREREQ IS INVALID")
      
    }

    emptyFields(){
      this.refs.preReqTitle.value = ''
      this.refs.preReqUrl.value = ''
    }

    removePreReq(event) {
      // looped item
      var item = event.item

      // index on the collection
      var index = this.preRequisites.indexOf(item)

      // remove from collection
      this.preRequisites.splice(index, 1)
    }

    function isPreReqTitleInvalid(title) {
      return ($.trim(title) === '')
    }
    function isPreReqUrlInvalid(url) {
      var urlPattern = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm)
      return (!urlPattern.test(url))
    }

    get(){
      return this.preRequisites
    }

    set(preReqs){
      this.preRequisites = preReqs || []
    }

  </script>
</pre-req>