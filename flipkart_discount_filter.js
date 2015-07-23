(function(){

    function init(){
        $(document).ready(function(){
            if($('#browse-filter').length){
                $('#facetList').append( '<div class="oneFacet">'+
                                            '<div class="facetContainer">'+
                                                '<div class="head line fk-uppercase">'+
                                                    '<div class="facet-title" title="Click to Collapse">'+
                                                        '<h2 class="unit line fk-font-15">Discount Filter</h2>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div id="discountfilter">'+
                                                    '<input id="txtdiscountFilter" type="text" style="width:100px;margin-right:10px;"/>'+
                                                    '<input id="btnDiscountFilter" type="button" style="width:50px;" value="Filter" onclick="javascript:"/>'+
                                                '</div>'+
                                                '<div class="clearfix"></div>'+
                                            '</div>'+
                                        '</div>');
            } else {
                console.log('filter not found');
            }
            bindEvents();
        });
    }

    function bindEvents(){
        $('#btnDiscountFilter').click(function(){
            filter($('#txtdiscountFilter').val());
        });
    }

    function filter(discount){
        var ajaxPool = [];
        var ongoing = [];

        $('.product-unit').find('.fk-product-thumb').each(function(){
            var $self = $(this);
            var href = $self.attr('href');
            var data = {};
            $self.css('opacity','0.5');
            var ajaxIndex = ajaxPool;
            var ajaxOptions = {
                url: href,
                type: "GET",
                dataType: "html",
                data: data,
                success: function(resp){
                    ajaxPool[ajaxIndex] = false;
                    if(parseInt($(resp).find('.discount').text().trim("OFF")) >= parseInt(discount)){
                        $self.css('opacity','1.0');
                    } else {
                        $self.css('opacity','0.1');
                    }
                    fireNextAjax();
                },
                error: function(){
                    ongoing[ajaxIndex] = false;
                    fireNextAjax();
                }
            };
            ajaxPool.push(ajaxOptions);
        });

        for(var i=0;i<10;i+=1){
            ongoing[i] = true;
            $.ajax(ajaxPool[i]);
        }

        function fireNextAjax(){
            for(var i=0;i<ajaxPool.length;i+=1){
                if(!ongoing[i] && ajaxPool[i]){
                    ongoing[i] = true;
                    $.ajax(ajaxPool[i]);
                    break;
                }
            }
        }
    }

    init();

})();
