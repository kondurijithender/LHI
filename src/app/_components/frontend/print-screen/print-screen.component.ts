import { Component, ElementRef, OnInit } from '@angular/core';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-print-screen',
  templateUrl: './print-screen.component.html',
  styleUrls: ['./print-screen.component.scss']
})
export class PrintScreenComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  downloadAsPDF(
    timeout = 2000
 ) {
    const element = document.getElementById('pdfTable') as HTMLElement,
       options = {
          imageTimeout: timeout,
          background: "white",
          allowTaint: true,
          useCORS: false,
          height: element.clientHeight,
          width: element.clientWidth
       };

    html2canvas(element, options).then((canvas) => {
       let imgData = canvas.toDataURL('image/png');

       let imgWidth = 210,
          pageHeight = 250,
          imgHeight = canvas.height * imgWidth / canvas.width,
          heightLeft = imgHeight,
          doc = new jsPDF('p', 'mm'),
          position = 0;

       doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
       heightLeft -= pageHeight;

       while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
       }
       doc.save('test' + '.pdf');
    });
 }
}
