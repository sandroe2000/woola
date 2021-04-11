export class ScrollTabsHelper {

    constructor() {

        this.hidWidth = 0;
        this.scrollBarWidths = 40;
        this.reAdjust();
        this.init(this);
    }

    init(scrollTabsHelper) {

        $(window).on('resize', (event) => {
            scrollTabsHelper.reAdjust();
        });

        $('.scroller-right').click(() => {

            $('.scroller-left').fadeIn('fast');
            //$('.scroller-right').fadeOut('slow');

            //$('.list').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){});
            $('.list').animate({ left: "+=" + (-150) + "px" }, 'fast', () => { });
        });

        $('.scroller-left').click(() => {

            //$('.scroller-right').fadeIn('slow');
            $('.scroller-left').fadeOut('slow');

            $('.list').animate({ left: "-=" + scrollTabsHelper.getLeftPosi() + "px" }, 'fast', () => { });
        });
    }

    widthOfList() {
        let itemsWidth = 0;
        $('.list a').each(function () {
            let itemWidth = $(this).outerWidth();
            itemsWidth += itemWidth;
        });
        return itemsWidth;
    };

    widthOfHidden() {
        return (($('.wrapper').outerWidth()) - this.widthOfList() - this.getLeftPosi()) - this.scrollBarWidths;
    };

    getLeftPosi() {
        return $('.list').position().left;
    };

    reAdjust() {
        //console.log(($('.wrapper').outerWidth()));
        //console.log(this.widthOfList());
        if (($('.wrapper').outerWidth()) < (this.widthOfList() + 30)) {
            $('.scroller-right').show().css('display', 'flex');
        }
        else {
            $('.scroller-right').hide();
        }

        if (this.getLeftPosi() < 0) {
            $('.scroller-left').show().css('display', 'flex');
        }
        else {
            $('.item').animate({ left: "-=" + this.getLeftPosi() + "px" }, 'fast');
            $('.scroller-left').hide();
        }
    }
}