  function addPreReq () {
    var preReqTitle = $('#preReqTitle').val()
    var preReqUrl = $('#preReqUrl').val()
    var preReqId = 'preReq' + $('.field').length
    $('<div class="field" id="' + preReqId + '"><div class="control"> <a class="tag is-danger" onClick="removePreReq(\'' + preReqId + '\')">REMOVE</a> <span>' + preReqTitle + ' - ' + preReqUrl + '</span></div></div>')
    .insertAfter('#preReq')
  }

  function removePreReq (preReqId) {
    var id = '#' + preReqId
    $(id).remove()
  }
