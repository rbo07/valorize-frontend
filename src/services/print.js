
// Gerador de PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

//Import Jquery resources
import $ from "jquery"


class Print {

    printDocument(id) {

        const input = document.getElementById(id);
        const scrimWidth = $(window).outerWidth()
        const scrimHeight = $('.scrim').outerHeight();

        // Interface
        $('.scrim').css('display', 'block');
        $('.scrim').css('padding-top', (scrimHeight / 2) - 50);
        $('.edit, .ant-btn, .pagination-wrap, .Menu, .btn.pdf, .btn.icon.add, .label-acoes').css('display', 'none');
        $('.Content').css('padding', '150px 50px 50px 50px');
        $('.Header').css('padding', '15px 25px 15px 50px');
        $('.btn-avatar').css('display', 'none');
        $('.Header .info-user').css('margin-right', '25px');

        html2canvas(input)
            .then((canvas) => {

                var pdf = null

                if(scrimWidth < 1200){
                    pdf = new jsPDF('p', 'mm', 'a4');
                } else {
                    pdf = new jsPDF('l', 'mm', 'a4');
                }

                let width = pdf.internal.pageSize.getWidth()
                let height = pdf.internal.pageSize.getHeight()
                let widthRatio = width / canvas.width
                let heightRatio = height / canvas.height
                let ratio = widthRatio > heightRatio ? heightRatio : widthRatio

                pdf.setFillColor('#037ed3');
                pdf.rect(0, 0, width, height, "F");

                pdf.addImage(
                    canvas.toDataURL('image/jpeg', 1.0),
                    'JPEG',
                    0,
                    0,
                    canvas.width * ratio,
                    canvas.height * ratio,
                )

                // Interface
                $('.edit, .ant-btn, .pagination-wrap, .Menu, .btn.pdf, .btn.icon.add, .label-acoes').css('display', 'inline-block');
                $('.Content').css('padding', '150px 50px 50px 125px');
                $('.Header').css('padding', '15px 25px 15px 125px');
                $('.btn-avatar').css('display', 'block');
                $('.Header .info-user').css('margin-right', '0');
                $('.scrim').css('display', 'none');

                pdf.save("Valorize-"+ id +".pdf");

            });
    }



}

export default new Print();
