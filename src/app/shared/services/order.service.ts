import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map } from 'rxjs';
import { Cart } from '../classes/cart';
import { IOrder, IOrderItem, IOrderToCreate, IOrderToUpdate } from '../classes/order';
import { environment } from '../../../environments/environment';
import autoTable, { RowInput } from 'jspdf-autotable';
import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import { ToastrTranslateService } from './toastr-translate.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tts: ToastrTranslateService
  ) {}

  // Create order
  // public createOrder(product: any, details: any, orderId: any, amount: any) {
  //   var item = {
  //       shippingDetails: details,
  //       product: product,
  //       orderId: orderId,
  //       totalAmount: amount
  //   };
  //   state.checkoutItems = item;
  //   localStorage.setItem("checkoutItems", JSON.stringify(item));
  //   localStorage.removeItem("cartItems");
  //   this.router.navigate(['/shop/checkout/success', orderId]);
  // }

  createOrder(order: IOrderToCreate) {
    return this.http.post(this.baseUrl + 'orders', order);
  }

  checkingPaymentStatus(paymentIntentId: string) {
    return this.http.get(this.baseUrl + 'orders/checkingPaymentStatus?paymentIntentId=' + paymentIntentId);
  }

  getOrderForUser() {
    return this.http.get(this.baseUrl + 'orders');
  }

  getSuccessOrderForUser() {
    return this.http.get(this.baseUrl + 'orders/getSuccessOrderForUser');
  }

  getOrderForUserById(id: number) {
    return this.http.get(this.baseUrl + 'orders/' + id);
  }

  getOrderById(id: number) {
    return this.http.get(this.baseUrl + 'orders/getOrderById?id=' + id);
  }

  getOrderByOrderNumber(orderNumber: number) {
    return this.http.get(this.baseUrl + 'orders/getOrderByOrderNumber?orderNumber=' + orderNumber);
  }

  getAllOrder() {
    return this.http.get(this.baseUrl + 'orders/getAllOrder');
  }

  getDeliveryMethods(cart: Cart) {
    return this.http.post(this.baseUrl + 'orders/deliveryMethods', cart).pipe(
      map((dm: any) => {
        return dm.sort((a: { price: number }, b: { price: number }) => a.price - b.price);
      })
    );
  }

  updateTrackingNumber(id: number, tracking: string) {
    return this.http.post(this.baseUrl + 'orders/updateTrackingNumber?id=' + id + '&trackingno=' + tracking, null);
  }

  updateOrder(order: IOrderToUpdate) {
    return this.http.post(this.baseUrl + 'orders/updateOrder', order);
  }

  getCouponByCode(code: string) {
    return this.http.get(this.baseUrl + 'orders/getCouponByCode?code=' + code);
  }

  async exportInvoicePDF(order: IOrder) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [595, 842], //A4
      putOnlyUsedFonts: true,
    });

    // add the font to jsPDF
    doc.addFileToVFS('noto-sans-thai-v20-thai-regular.ttf', this.fontBase64);
    doc.addFont('noto-sans-thai-v20-thai-regular.ttf', 'Noto', 'normal');
    doc.setFont('Noto');

    doc.setFontSize(20);
    var textDimensions = doc.getTextDimensions(this.tts.getTranslate('Invoice'));
    var textWidth = textDimensions.w;
    doc.addImage('assets/images/icon/herbist.png', 'JPEG', 595 / 2 - 167 / 1.5 / 2, 45, 167 / 1.5, 34 / 1.5);
    doc.text(this.tts.getTranslate('Invoice'), 595 / 2 - textWidth / 2, 90);

    doc.setFontSize(12);
    doc.text(this.tts.getTranslate('Invoice Number') + ': ' + order.orderNumber, 40, 130);
    doc.text(this.tts.getTranslate('Invoice Date') + ': ' + formatDate(order.orderDate, 'dd/MM/yyyy HH:mm', 'en-US'), 40, 145);
    doc.text(this.tts.getTranslate('Order Number') + ': ' + order.orderNumber, 40, 160);
    doc.text(this.tts.getTranslate('Order Date') + ': ' + formatDate(order.orderDate, 'dd/MM/yyyy HH:mm', 'en-US'), 40, 175);

    const customerPosition = 595 / 2 - doc.getTextDimensions(this.tts.getTranslate('Customer')).w / 2 - 50;
    doc.setFontSize(16);
    doc.text(this.tts.getTranslate('Provider'), 40, 220);
    doc.text(this.tts.getTranslate('Customer'), customerPosition, 220);
    doc.text(this.tts.getTranslate('Shipping Info'), 400, 220);

    //ร้านค้า (Provider)
    doc.setFontSize(12);
    doc.text('www.herbist.shop', 40, 240);
    doc.text(this.tts.getTranslate('TaxId 1101800040536'), 40, 255);
    doc.text(this.tts.getTranslate('193/1 Bangkhuntien-Chaytale'), 40, 270);
    doc.text(this.tts.getTranslate('Samae Dam Bangkhuntien'), 40, 285);
    doc.text(this.tts.getTranslate('Bangkok 10150'), 40, 300);

    //ลูกค้า (Customer)
    doc.text(order.shipToAddress.billing_FirstName + ' ' + order.shipToAddress.billing_LastName, customerPosition, 240);
    doc.text(order.shipToAddress.billing_Street, customerPosition, 255);
    doc.text(order.shipToAddress.billing_City, customerPosition, 270);
    doc.text(order.shipToAddress.billing_Province + ' ' + order.shipToAddress.billing_ZipCode, customerPosition, 285);
    doc.text(order.shipToAddress.billing_Telephone, customerPosition, 300);

    //สถานที่จัดส่ง (Shipping Info
    const shippingPosition = 400;
    doc.text(order.shipToAddress.firstName + ' ' + order.shipToAddress.lastName, shippingPosition, 240);
    doc.text(order.shipToAddress.street, shippingPosition, 255);
    doc.text(order.shipToAddress.city, shippingPosition, 270);
    doc.text(order.shipToAddress.province + ' ' + order.shipToAddress.zipCode, shippingPosition, 285);
    doc.text(order.shipToAddress.telephone, shippingPosition, 300);

    let productTableHeight = 0;
    let productTableWidth = 0;
    // autoTable(doc, { html: '#my-table' })
    // Or use javascript directly:
    autoTable(doc, {
      // body: [
      //   { europe: 'Sweden', america: 'Canada', asia: 'China' },
      //   { europe: 'Norway', america: 'Mexico', asia: 'Japan' },
      // ],
      styles: {
        fontSize: 12,
      },
      columns: [
        { header: this.tts.getTranslate('Index'), dataKey: 'index' },
        // { header: 'ภาพสินค้า/Image', dataKey: 'image' },
        { header: this.tts.getTranslate('Product Name'), dataKey: 'productName' },
        { header: this.tts.getTranslate('Quantity'), dataKey: 'amount' },
        { header: this.tts.getTranslate('Price2'), dataKey: 'price' },
        { header: this.tts.getTranslate('Discount'), dataKey: 'discount' },
        { header: this.tts.getTranslate('Total'), dataKey: 'total' },
      ],
      // head: [['productName', 'ลำดับ/Index', 'รหัสสินค้า/Product Id', 'สินค้า/Product Name', 'จำนวน/Amount', 'ราคาต่อหน่วย/Price', 'จำนวนเงิน/Total']],
      body: this.getInvoiceDetails(order.orderItems),
      margin: { top: 330 },
      headStyles: {
        halign: 'center',
        fillColor: [86, 83, 101],
        font: 'Noto',
        fontStyle: 'normal',
      },
      columnStyles: {
        index: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        productName: { halign: 'left', font: 'Noto', fontStyle: 'normal' },
        amount: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        price: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        discount: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        total: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        // 0: { halign: 'center', font: 'Noto' },
        // 1: { halign: 'left', font: 'Noto' },
        // 2: { halign: 'left', font: 'Noto' },
        // 3: { halign: 'left', font: 'Noto' },
        // 4: { halign: 'left', font: 'Noto' },
      },
      didDrawPage: (d) => {
        productTableHeight = d.cursor!.y;
        productTableWidth = d.cursor!.x;
        // console.log(d.cursor!.y);
      },
      // didDrawCell: (data) => {
      //   if (data.section === 'body' && data.column.index === 1) {
      //     var base64Img = data!.cell.raw?.toString();
      //     // console.log(data.cell.raw)
      //     doc.addImage(base64Img!, 'JPEG', data.cell.x + 2, data.cell.y + 2, 20, 20)
      //   }
      // },
    });

    //Total
    autoTable(doc, {
      head: [
        {
          key: 'key',
          value: 'value',
        },
      ],
      body: this.getInvoiceTotalDetails(order),
      startY: productTableHeight + 20,
      margin: { left: productTableWidth - 240 },
      headStyles: {
        cellWidth: 120,
        halign: 'right',
        fillColor: [86, 83, 101],
        font: 'Noto',
        fontStyle: 'normal',
      },
      didParseCell: (hookData) => {
        if (hookData.section === 'head') {
          // console.log(hookData);
          hookData.settings.showHead = 'never';
          // if (hookData.row.cells === 0) {
          //     hookData.cell.styles.fillColor = [86, 83, 101];
          // }
        }
      },
      styles: {
        fontSize: 12,
      },
      columnStyles: {
        0: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
          textColor: 'white',
          fillColor: [86, 83, 101],
        },
        1: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
        },
      },
      willDrawCell: (hookData) => {
        // console.log(hookData);
        // console.log(hookData.row.index);
        // console.log(hookData.table.body.length);
        var rows = hookData.table.body;
        if (hookData.row.index === rows.length - 1) {
          doc.setFontSize(14);
          doc.setTextColor('white');
          doc.setFillColor('#4D4A5A');
        }
      },
      didDrawPage: (d) => {
        productTableHeight = d.cursor!.y;
        productTableWidth = d.cursor!.x;
        // console.log(d.cursor!.y);
      },
    });

    //Footer 1
    autoTable(doc, {
      head: [
        {
          key: 'key',
          value: 'value',
        },
      ],
      body: this.getInvoiceFooterDetails1(order),
      startY: productTableHeight + 50,
      headStyles: {
        halign: 'right',
        fillColor: [86, 83, 101],
        font: 'Noto',
        fontStyle: 'normal',
      },
      didParseCell: (hookData) => {
        if (hookData.section === 'head') {
          // console.log(hookData);
          hookData.settings.showHead = 'never';
          // if (hookData.row.cells === 0) {
          //     hookData.cell.styles.fillColor = [86, 83, 101];
          // }
        }
      },
      styles: {
        fontSize: 12,
      },
      columnStyles: {
        0: {
          cellWidth: 200,
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
          textColor: 'white',
          fillColor: [86, 83, 101],
        },
        1: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
        },
      },
      didDrawPage: (d) => {
        productTableHeight = d.cursor!.y;
        productTableWidth = d.cursor!.x;
        // console.log(d.cursor!.y);
      },
    });

    //Footer 2
    autoTable(doc, {
      head: [
        {
          keyname: 'keyname',
          value: 'value',
        },
      ],
      body: this.getInvoiceFooterDetails2(order),
      startY: productTableHeight + 25,
      headStyles: {
        halign: 'right',
        fillColor: [86, 83, 101],
        font: 'Noto',
        fontStyle: 'normal',
      },
      didParseCell: (hookData: any) => {
        if (hookData.section === 'head') {
          // console.log(hookData);
          hookData.settings.showHead = 'never';
          // if (hookData.row.cells === 0) {
          //     hookData.cell.styles.fillColor = [86, 83, 101];
          // }
        }
      },
      columnStyles: {
        0: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
          textColor: 'white',
          fillColor: [86, 83, 101],
        },
        1: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
        },
      },
      willDrawCell: (hookData: any) => {
        // console.log(hookData);
        // console.log(hookData.row.index);
        // console.log(hookData.table.body.length);
        var rows = hookData.table.body;
        if (hookData.row.index === rows.length - 1) {
          doc.setFontSize(11);
          doc.setTextColor('white');
          doc.setFillColor('#4D4A5A');
        }
      },
      didDrawPage: (d) => {
        productTableHeight = d.cursor!.y;
        productTableWidth = d.cursor!.x;
        // console.log(d.cursor!.y);
      },
    });
    // doc.setFontSize(12);
    // doc.text('รวม (Sub Total)', 350, 440);
    // doc.text('฿' + order.subTotal.toString(), 480, 440);
    // doc.text('ส่วนลด (Discount)', 350, 460);
    // doc.text('฿' + order.discount.toString(), 480, 460);
    // doc.text('ค่าจัดส่ง (Shipping)', 350, 480);
    // doc.text('฿' + order.shippingPrice.toString(), 480, 480);

    // doc.setFontSize(16);
    // doc.text('รวมทั้งสิ้น (Total)', 350, 510);
    // doc.text('฿' + order.total.toString(), 480, 510);
    //doc.line(20, 25, 60, 25);
    //return doc;
    doc.save('herbist_' + formatDate(new Date(), 'yyyyMMdd', 'en') + '_inv_' + order.orderNumber + '.pdf');
  }

  getInvoiceTotalDetails(order: IOrder) {
    return [
      {
        key: this.tts.getTranslate('Sub Total'),
        value: '฿' + order.subTotal.toLocaleString('en-US'),
      },
      {
        key: this.tts.getTranslate('Coupon Code2'),
        value: order.coupon == null ? '' : '-฿' + order.couponDiscount + ' (' + order.coupon.code + ')',
      },
      {
        key: this.tts.getTranslate('Discount'),
        value: '-฿' + order.discount.toLocaleString('en-US'),
      },
      {
        key: this.tts.getTranslate('Shipping') + ' (' + order.deliveryMethod + ')',
        value: '฿' + order.shippingPrice.toLocaleString('en-US'),
      },
      {
        key: this.tts.getTranslate('Total2'),
        value: '฿' + order.total.toLocaleString('en-US'),
      },
    ] as RowInput[];
  }

  getInvoiceFooterDetails1(order: IOrder) {
    return [
      {
        key: this.tts.getTranslate('Shipping'),
        value: order.deliveryMethod,
      },
      {
        key: this.tts.getTranslate('Payment Method'),
        value: this.tts.getTranslate('Direct Transfer'),
      },
      {
        key: this.tts.getTranslate('Bank Name'),
        value: this.tts.getTranslate('Siam Commercial Bank'),
      },
      {
        key: this.tts.getTranslate('Acc Number'),
        value: '046-275455-4',
      },
      {
        key: this.tts.getTranslate('Acc Name'),
        value: this.tts.getTranslate('THANAWAT SUKWIBUL'),
      },
    ] as RowInput[];
  }

  getInvoiceFooterDetails2(order: IOrder) {
    return [
      [
        {
          colSpan: 2,
          styles: { halign: 'center' },
          content: this.tts.getTranslate('Invoice') + ' ' + order.orderNumber + ' ' + this.tts.getTranslate('Is valid for 12 hours from the date and time of purchase. Please transfer payment within the specified time.'),
        },
      ],
    ] as RowInput[];
  }

  getInvoiceDetails(items: IOrderItem[]) {
    let prepareData: RowInput[] = [];
    items.forEach((item, i) => {
      //console.log(item.pictureUrl)
      prepareData.push({
        image: item.pictureUrl, //https://localhost:8089/Content/images/products/greekoregano_front.webp
        index: i + 1,
        productName: item.productName,
        amount: item.quantity,
        price: '฿' + item.price,
        discount: '฿' + ((item.discount * item.price) / 100) * item.quantity,
        total: item.discount !== 0 ? '฿' + (((item.discount * item.price) / 100) * item.quantity).toLocaleString('en-US') : '฿' + (item.price * item.quantity).toLocaleString('en-US'),
      });
    });

    return prepareData!;
  }

  async exportReceiptPDF(order: IOrder) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [595, 842], //A4
      putOnlyUsedFonts: true,
    });

    // add the font to jsPDF
    doc.addFileToVFS('noto-sans-thai-v20-thai-regular.ttf', this.fontBase64);
    doc.addFont('noto-sans-thai-v20-thai-regular.ttf', 'Noto', 'normal');
    doc.setFont('Noto');

    doc.setFontSize(20);
    var textDimensions = doc.getTextDimensions(this.tts.getTranslate('Receipt'));
    var textWidth = textDimensions.w;
    doc.addImage('assets/images/icon/herbist.png', 'JPEG', 595 / 2 - 167 / 1.5 / 2, 45, 167 / 1.5, 34 / 1.5);
    doc.text(this.tts.getTranslate('Receipt'), 595 / 2 - textWidth / 2, 90);

    doc.setFontSize(12);
    doc.text(this.tts.getTranslate('Receipt Number') + ': ' + order.orderNumber, 40, 130);
    doc.text(this.tts.getTranslate('Receipt Date') + ': ' + formatDate(order.orderDate, 'dd/MM/yyyy HH:mm', 'en-US'), 40, 145);
    doc.text(this.tts.getTranslate('Order Number') + ': ' + order.orderNumber, 40, 160);
    doc.text(this.tts.getTranslate('Order Date') + ': ' + formatDate(order.orderDate, 'dd/MM/yyyy HH:mm', 'en-US'), 40, 175);

    const customerPosition = 595 / 2 - doc.getTextDimensions(this.tts.getTranslate('Customer')).w / 2 - 50;
    doc.setFontSize(16);
    doc.text(this.tts.getTranslate('Provider'), 40, 220);
    doc.text(this.tts.getTranslate('Customer'), customerPosition, 220);
    doc.text(this.tts.getTranslate('Shipping Info'), 400, 220);

    //ร้านค้า (Provider)
    doc.setFontSize(12);
    doc.text('www.herbist.shop', 40, 240);
    doc.text(this.tts.getTranslate('TaxId 1101800040536'), 40, 255);
    doc.text(this.tts.getTranslate('193/1 Bangkhuntien-Chaytale'), 40, 270);
    doc.text(this.tts.getTranslate('Samae Dam Bangkhuntien'), 40, 285);
    doc.text(this.tts.getTranslate('Bangkok 10150'), 40, 300);

    //ลูกค้า (Customer)
    doc.text(order.shipToAddress.billing_FirstName + ' ' + order.shipToAddress.billing_LastName, customerPosition, 240);
    doc.text(order.shipToAddress.billing_Street, customerPosition, 255);
    doc.text(order.shipToAddress.billing_City, customerPosition, 270);
    doc.text(order.shipToAddress.billing_Province + ' ' + order.shipToAddress.billing_ZipCode, customerPosition, 285);
    doc.text(order.shipToAddress.billing_Telephone, customerPosition, 300);

    //สถานที่จัดส่ง (Shipping Info
    const shippingPosition = 400;
    doc.text(order.shipToAddress.firstName + ' ' + order.shipToAddress.lastName, shippingPosition, 240);
    doc.text(order.shipToAddress.street, shippingPosition, 255);
    doc.text(order.shipToAddress.city, shippingPosition, 270);
    doc.text(order.shipToAddress.province + ' ' + order.shipToAddress.zipCode, shippingPosition, 285);
    doc.text(order.shipToAddress.telephone, shippingPosition, 300);

    let productTableHeight = 0;
    let productTableWidth = 0;
    // autoTable(doc, { html: '#my-table' })
    // Or use javascript directly:
    autoTable(doc, {
      // body: [
      //   { europe: 'Sweden', america: 'Canada', asia: 'China' },
      //   { europe: 'Norway', america: 'Mexico', asia: 'Japan' },
      // ],
      styles: {
        fontSize: 12,
      },
      columns: [
        { header: this.tts.getTranslate('Index'), dataKey: 'index' },
        // { header: 'ภาพสินค้า/Image', dataKey: 'image' },
        { header: this.tts.getTranslate('Product Name'), dataKey: 'productName' },
        { header: this.tts.getTranslate('Quantity'), dataKey: 'amount' },
        { header: this.tts.getTranslate('Price2'), dataKey: 'price' },
        { header: this.tts.getTranslate('Discount'), dataKey: 'discount' },
        { header: this.tts.getTranslate('Total'), dataKey: 'total' },
      ],
      // head: [['productName', 'ลำดับ/Index', 'รหัสสินค้า/Product Id', 'สินค้า/Product Name', 'จำนวน/Amount', 'ราคาต่อหน่วย/Price', 'จำนวนเงิน/Total']],
      body: this.getInvoiceDetails(order.orderItems),
      margin: { top: 330 },
      headStyles: {
        halign: 'center',
        fillColor: [86, 83, 101],
        font: 'Noto',
        fontStyle: 'normal',
      },
      columnStyles: {
        index: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        productName: { halign: 'left', font: 'Noto', fontStyle: 'normal' },
        amount: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        price: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        discount: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        total: { halign: 'center', font: 'Noto', fontStyle: 'normal' },
        // 0: { halign: 'center', font: 'Noto' },
        // 1: { halign: 'left', font: 'Noto' },
        // 2: { halign: 'left', font: 'Noto' },
        // 3: { halign: 'left', font: 'Noto' },
        // 4: { halign: 'left', font: 'Noto' },
      },
      didDrawPage: (d) => {
        productTableHeight = d.cursor!.y;
        productTableWidth = d.cursor!.x;
        // console.log(d.cursor!.y);
      },
      // didDrawCell: (data) => {
      //   if (data.section === 'body' && data.column.index === 1) {
      //     var base64Img = data!.cell.raw?.toString();
      //     // console.log(data.cell.raw)
      //     doc.addImage(base64Img!, 'JPEG', data.cell.x + 2, data.cell.y + 2, 20, 20)
      //   }
      // },
    });

    //Total
    autoTable(doc, {
      head: [
        {
          key: 'key',
          value: 'value',
        },
      ],
      body: this.getInvoiceTotalDetails(order),
      startY: productTableHeight + 20,
      margin: { left: productTableWidth - 240 },
      headStyles: {
        cellWidth: 120,
        halign: 'right',
        fillColor: [86, 83, 101],
        font: 'Noto',
        fontStyle: 'normal',
      },
      didParseCell: (hookData) => {
        if (hookData.section === 'head') {
          // console.log(hookData);
          hookData.settings.showHead = 'never';
          // if (hookData.row.cells === 0) {
          //     hookData.cell.styles.fillColor = [86, 83, 101];
          // }
        }
      },
      styles: {
        fontSize: 12,
      },
      columnStyles: {
        0: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
          textColor: 'white',
          fillColor: [86, 83, 101],
        },
        1: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
        },
      },
      willDrawCell: (hookData) => {
        // console.log(hookData);
        // console.log(hookData.row.index);
        // console.log(hookData.table.body.length);
        var rows = hookData.table.body;
        if (hookData.row.index === rows.length - 1) {
          doc.setFontSize(14);
          doc.setTextColor('white');
          doc.setFillColor('#4D4A5A');
        }
      },
      didDrawPage: (d) => {
        productTableHeight = d.cursor!.y;
        productTableWidth = d.cursor!.x;
        // console.log(d.cursor!.y);
      },
    });

    //Footer 1
    autoTable(doc, {
      head: [
        {
          key: 'key',
          value: 'value',
        },
      ],
      body: this.getInvoiceFooterDetails1(order),
      startY: productTableHeight + 50,
      headStyles: {
        halign: 'right',
        fillColor: [86, 83, 101],
        font: 'Noto',
        fontStyle: 'normal',
      },
      didParseCell: (hookData) => {
        if (hookData.section === 'head') {
          // console.log(hookData);
          hookData.settings.showHead = 'never';
          // if (hookData.row.cells === 0) {
          //     hookData.cell.styles.fillColor = [86, 83, 101];
          // }
        }
      },
      styles: {
        fontSize: 12,
      },
      columnStyles: {
        0: {
          cellWidth: 200,
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
          textColor: 'white',
          fillColor: [86, 83, 101],
        },
        1: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
        },
      },
      didDrawPage: (d) => {
        productTableHeight = d.cursor!.y;
        productTableWidth = d.cursor!.x;
        // console.log(d.cursor!.y);
      },
    });

    //Footer 2
    autoTable(doc, {
      head: [
        {
          keyname: 'keyname',
          value: 'value',
        },
      ],
      body: this.getReceiptFooterDetails2(order),
      startY: productTableHeight + 25,
      headStyles: {
        halign: 'right',
        fillColor: [86, 83, 101],
        font: 'Noto',
        fontStyle: 'normal',
      },
      didParseCell: (hookData: any) => {
        if (hookData.section === 'head') {
          // console.log(hookData);
          hookData.settings.showHead = 'never';
          // if (hookData.row.cells === 0) {
          //     hookData.cell.styles.fillColor = [86, 83, 101];
          // }
        }
      },
      columnStyles: {
        0: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
          textColor: 'white',
          fillColor: [86, 83, 101],
        },
        1: {
          halign: 'left',
          font: 'Noto',
          fontStyle: 'normal',
        },
      },
      willDrawCell: (hookData: any) => {
        // console.log(hookData);
        // console.log(hookData.row.index);
        // console.log(hookData.table.body.length);
        var rows = hookData.table.body;
        if (hookData.row.index === rows.length - 1) {
          doc.setFontSize(11);
          doc.setTextColor('white');
          doc.setFillColor('#4D4A5A');
        }
      },
      didDrawPage: (d) => {
        productTableHeight = d.cursor!.y;
        productTableWidth = d.cursor!.x;
        // console.log(d.cursor!.y);
      },
    });
    // doc.setFontSize(12);
    // doc.text('รวม (Sub Total)', 350, 440);
    // doc.text('฿' + order.subTotal.toString(), 480, 440);
    // doc.text('ส่วนลด (Discount)', 350, 460);
    // doc.text('฿' + order.discount.toString(), 480, 460);
    // doc.text('ค่าจัดส่ง (Shipping)', 350, 480);
    // doc.text('฿' + order.shippingPrice.toString(), 480, 480);

    // doc.setFontSize(16);
    // doc.text('รวมทั้งสิ้น (Total)', 350, 510);
    // doc.text('฿' + order.total.toString(), 480, 510);
    //doc.line(20, 25, 60, 25);
    //return doc;
    doc.save('herbist_' + formatDate(new Date(), 'yyyyMMdd', 'en') + '_inv_' + order.orderNumber + '.pdf');
  }

  getReceiptFooterDetails2(order: IOrder) {
    return [
      [
        {
          colSpan: 2,
          styles: { halign: 'center' },
          content: this.tts.getTranslate('We have received payment from invoice') + ' ' + order.orderNumber + ' ' + this.tts.getTranslate('Thank you for shopping with us'),
        },
      ],
    ] as RowInput[];
  }

  fontBase64 =
    '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AAD/EQJyACwDhwA/AmEAVAIjACICIwAiAiAAPwJaAEICLwA6AAD+LAJbABMCWwATAnwAPwJlADsArwALAAAAAAAA/+sAAP+TAlIAMAHsACYAAP7yAlIARAONAEIDewBCAjoAOgI8ADECPABZAjwAMAI8AC0CPAAVAjwAPwI8ADcCPAAsAjwAMQI8ADIBDABIAQwASAMXAEgBDQBIAicAKQKGABkBdAAKAXQACgEsACgBLAAeAXwAHAF8ACABSQBQAUkAGQFnAAwBZwAMAK8ADACvAAwB/QAoAf0AJwGYAEEA4QBBAicA7wI8ADICPABAAjwAMgI8ADgCPAAyAjwAMgM/ADECfwAAAn8AAAJ/AAACfwAAAn8AAAJ/AAACfwAAA3H//wKKAGECeAA9AngAPQLaAGEC2gAeAiwAYQIsAGECLABhAiwAYQIsAGECBwBhAtgAPQLlAGEBUwAoAVMAKAFTAAEBUwAeAVMAKAER/7ICawBhAgwAYQOLAGEC+ABhAvgAYQMNAD0DDQA9Aw0APQMNAD0DDQA9Aw0APQMNAD0DoAA9Al0AYQJdAGEDDQA9Am4AYQIlADMCLAAKAtsAWgLbAFoC2wBaAtsAWgLbAFoCWAAAA6IADAJKAAQCNgAAAjYAAAI8ACYCMQAuAjEALgIxAC4CMQAuAjEALgIxAC4CMQAuA2AALgJnAFUB4AA3AeAANwJnADcCXQA3AjQANwI0ADcCNAA3AjQANwI0ADcBWAAPAmcANwJqAFUBAgBOAQIAVQECAEwBAv/YAQL/9QEC//8BAv/JAhYAVQECAFUDpwBVAmoAVQJqAFUCXQA3Al0ANwJdADcCXQA3Al0ANwJdADcCXQA3A7IANgJnAFUCZwBVAmcANwGdAFUB3wAzAncAVQFpABACagBPAmoATwJqAE8CagBPAmoATwH8AAADEgALAhEAEgH+AAEB/gABAf4AAQHWACcBZQAgAXgAIAEMACkBDAAfAQ0ASAGyAAwBsgAYAQwASAF4AE0B9AAoA+gAKAG8//4A+gAfAaAAHwE2ACgBNgAnA4MAOgLcADUCjwA3AgEAOwNAADEDQAAxAwUAEQGsADcCPABbAjwAPgI8ABcCPAAgAjwADgI8ADICPAAmAkQAlQEZACgBGQAoAaIAKAEsACgBvwAoAfT//QDhAA4BQgAoAAEAAAQl/j4AAAPo/U3/FwPAAAEAAAAAAAAAAAAAAAAAAAFNAAQCLgGQAAUAAAKKAlgAAABLAooCWAAAAV4AMgFOAAACCwUCBAUEAgIEgQAAIwAAIAAAAAAAAAAAAEdPT0cAwAAAJcwEJf4+AAAEJQHCAAEAkwAAAAACLALKAAAAIAADAAAAAgAAAAMAAAAUAAMAAQAAABQABAMkAAAAQgBAAAUAAgAAAA0ALwA5AH4AowClAKsAsAC0ALgAuwD/ATEBUwK8AsYC2gLcDjoOWyANIBQgGiAeICIgJiA6IKwhIiISJcz//wAAAAAADQAgADAAOgCgAKUApwCuALQAtgC6AL8BMQFSArwCxgLaAtwOAQ4/IAsgEyAYIBwgIiAmIDkgrCEiIhIlzP//AAL/9AAAAFgAAAAAAJwAAAAAAJIAAAAAAAD/zgAA/cH+gf5u/m0AAAAA4HPhGwAAAADhC+Bu4Prgk+AZ3zratQABAAAAAAA+AAAAWgDiAAAA5gDuAAAA8AD0APYAAAF0AAAAAAAAAAABbgHgAAAAAAIUAhgAAAAAAAAAAAAAAAAAAAAAAGwAlQCmAJcBPgCvATYApwCaAJsAlgCpAScAFQCSAJgAkwEoAK4ArACtASoBNQCwALgAuQC7AL0AwgDDAMQAxQDKAMsAzADNAM4A0ADYANoA2wDcAN0A3gDjAOQA5QDmAOgAngCZAJ8BQwEwAUUA6QDxAPIA9AD2APsA/AD9AP4BBAEFAQYBBwEIAQoBEgEUARUBFgEYARkBHgEfASABIQEkAJwAqACdAUIANgEpAT0BQAE4AUQBOQElAKQBOgFKATwBNwEsAUsBJgClASsAtACxALIAtgCzALUAtwC6AMEAvgC/AMAAyQDGAMcAyAC8AM8A1ADRANIA1gDTAKoA1QDiAN8A4ADhAOcA2QEXAO0A6gDrAO8A7ADuAPAA8wD6APcA+AD5AQMBAAEBAQIA9QEJAQ4BCwEMARABDQCrAQ8BHQEaARsBHAEiARMBIwDXAREAHAAWABgAGQAXABoANwAGAAgABwBqAAkAhQAKAHkAcwBwAHEAQwAMAHsAdgByAHUARAAFAE0ASwAPAEoAEABMADUAhABOAE8AIAAhAIIAaQBoAGsAEwAeAEUAFABHAFIAKgBTAFcAWQBbAGAAYgBeAGQASAAEAFgAVABdAFYAVQAdADQAMgAnACwALwAkAG0AOACDABEAhwBGAHwAdwASAA4AZwBmAA0AQgADABsAogCjATEAoAChATK4Af+FsASNAAAAAAwAlgADAAEECQAAAJYAAAADAAEECQABABwAlgADAAEECQACAA4AsgADAAEECQADAD4AwAADAAEECQAEACwA/gADAAEECQAFABoBKgADAAEECQAGACgBRAADAAEECQAOADYBbAADAAEECQEAAAwBogADAAEECQEBAAoBrgADAAEECQEFAA4AsgADAAEECQFKAAwBuABDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAyADIAIABUAGgAZQAgAE4AbwB0AG8AIABQAHIAbwBqAGUAYwB0ACAAQQB1AHQAaABvAHIAcwAgACgAaAB0AHQAcABzADoALwAvAGcAaQB0AGgAdQBiAC4AYwBvAG0ALwBuAG8AdABvAGYAbwBuAHQAcwAvAHQAaABhAGkAKQBOAG8AdABvACAAUwBhAG4AcwAgAFQAaABhAGkAUgBlAGcAdQBsAGEAcgAyAC4AMAAwADEAOwBHAE8ATwBHADsATgBvAHQAbwBTAGEAbgBzAFQAaABhAGkALQBSAGUAZwB1AGwAYQByAE4AbwB0AG8AIABTAGEAbgBzACAAVABoAGEAaQAgAFIAZQBnAHUAbABhAHIAVgBlAHIAcwBpAG8AbgAgADIALgAwADAAMQBOAG8AdABvAFMAYQBuAHMAVABoAGEAaQAtAFIAZQBnAHUAbABhAHIAaAB0AHQAcABzADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwAVwBlAGkAZwBoAHQAVwBpAGQAdABoAE4AbwByAG0AYQBsAAAAAwAAAAAAAP+cADIAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAH//wAPAAEAAgAOAAAAAAAAAJYAAgAWAAUADAABAA8AEAABABMAFAABABYAGgABABwAHAABAB4AIgABACQAMwADADUANQABADcANwABADgAQQADAEMARQABAEgASQADAEoAUAABAFkAXAADAF4AZQADAGgAawABAG0AbwADAHAAdgABAHkAewABAIEAggABAIMAgwADAIQAhgABAAEAAgAAAAwAAAAcAAEABgBIAEkAXgBfAGQAZQACAAYAJAAzAAAAOAA5ABAAWQBcABIAYABjABYAbQBvABoAgwCDAB0AAAABAAAAFAAoAAoABAA6ADIARABOAANERkxUAE5sYXRuAGZ0aGFpAE4AA2tlcm4APm1hcmsARG1rbWsASgAEAAAAAQBOAAIACAACAHYA9gAGABAAAQBIAAAABgAQAAEASgABAEwAAAAAAAEAAAAAAAEAAQAAAAIAAgADAAAAAk1PTCAANFJPTSAANAABCDwIqAACCn4LUgABB94H3gABB+4H0AABB/wH/AABCO4IUgAA//8AAwAAAAEAAgABC/wABAAAADsJUAlQCgAJVgm+Cb4Jvgm+Cb4JVgl6CXoJegl0CVwJXAlcCVwJXAlcCVwJYgnUCXQJdAliCWIJYgliCWIK4Al0CXQJdAl0CXQJdAl0CWIJhAmECXQJjgmYCWgJaAmiCaIJrAloCWgJaAloCWgKGgo0CW4JdAnqAAIL9gAEAAAMkA2EABoAIwAAAAAAAAAAAAAAAAAA/+wAAAAAAAD/9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//YAAAAAAAAAAAAA/+wAAAAAAAAAAP/YAAAAAAAAAAAAAAAAAAAAAAAA//b/9gAAAAAAAAAAAAAAAAAA/+L/9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/7AAAAAAAAAAAAAAAAAAAAAD/ugAAAAAAAAAAAAAAAAAAAAD/2P/EAAAAAAAAAAAAAAAAAAD/ugAAAAAAAAAAAAAAAP/EAAD/4gAA/7r/2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQACgAAAAAAAAAAAAAAAP+wABQAAP/i/+IAAAAAAAAAAAAAAAAAAP/2AAAAAAAAAAD/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//EAAAAAAAAAAAAAAAAAAP/0//UAAAAA/+P/9v/2/+0AAAAAAAAAAP/2//b/9gAAAAAAAAAAAAAAAP/6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/YACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/OAAAAAAAAAAAAAP/sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/E/8QAAAAAAAAAAAAAAAAAAP+6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2AAAAAAAAAAAAAAAAAAA/+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/zgAAAAAAAAAA/34AAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+wAAAAAAAAAAAAA/+IAAP/2AAAAAAAAAAAAAP/s//b/9gAA/9j/7AAAAAAAAP/OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/i//YAAAAAAAAAAAAAAAAAAP/2//YAAAAAAAD/zv/s/+IAAP/E/84AAAAAAAD/xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/sP/iAAAAAAAAAAAAAAAAAAD/zv/YAAD/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9v/iAAAAAAAAAAAAAAAAAAD/4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+L/sAAAAAAAAAAAAAAAAAAA/8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/sAAAAAAAAAAAAAAAAAAAAAAAA/+wAAAAAAAAAAAAA//YAAAAA/7AAAAAAAAAAAAAAAAAAAAAA/+z/4gAAAAAAAAAAAAAAAAAA/+wAAAAAAAAAAAAAAAD/uv/s/84AAP+6/7D/7AAAAAD/xAAAAAAAAAAA/9gAAAAAAAAAAAAAAAD/xP/iAAAAAAAA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';
}
