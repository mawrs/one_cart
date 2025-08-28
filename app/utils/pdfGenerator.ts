import jsPDF from 'jspdf';
import { Order } from '../types';
import { mockProducts, mockSuppliers } from '../data/mockData';

export const generateInvoicePDF = (order: Order): void => {
  const pdf = new jsPDF();
  
  // Set up the document
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let currentY = margin;

  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('☕ CoffeeCart Invoice', margin, currentY);
  
  currentY += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Order ID: ${order.id}`, margin, currentY);
  
  currentY += 8;
  pdf.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, margin, currentY);
  
  currentY += 8;
  const deliveryWindow = `${new Date(order.deliveryWindow.start).toLocaleDateString()} - ${new Date(order.deliveryWindow.end).toLocaleDateString()}`;
  pdf.text(`Delivery Window: ${deliveryWindow}`, margin, currentY);

  currentY += 20;

  // Order items by supplier
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Order Details', margin, currentY);
  currentY += 15;

  order.supplierBreakdown.forEach((supplierOrder, index) => {
    const supplier = mockSuppliers.find(s => s.id === supplierOrder.supplierId);
    if (!supplier) return;

    // Supplier header
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(supplier.name, margin, currentY);
    
    currentY += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Delivery Date: ${new Date(supplierOrder.deliveryDate).toLocaleDateString()}`, margin, currentY);
    
    currentY += 12;

    // Items table header
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Product', margin, currentY);
    pdf.text('Qty', margin + 120, currentY);
    pdf.text('Unit Price', margin + 140, currentY);
    pdf.text('Total', margin + 170, currentY);
    
    currentY += 8;
    
    // Draw line under header
    pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2);
    currentY += 5;

    // Items
    pdf.setFont('helvetica', 'normal');
    supplierOrder.items.forEach(item => {
      const product = mockProducts.find(p => p.id === item.productId);
      if (!product) return;

      const itemTotal = product.price * item.quantity;
      
      pdf.text(product.name, margin, currentY);
      pdf.text(item.quantity.toString(), margin + 120, currentY);
      pdf.text(`$${product.price.toFixed(2)}`, margin + 140, currentY);
      pdf.text(`$${itemTotal.toFixed(2)}`, margin + 170, currentY);
      
      currentY += 8;
    });

    // Supplier subtotal
    currentY += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${supplier.name} Subtotal:`, margin + 120, currentY);
    pdf.text(`$${supplierOrder.subtotal.toFixed(2)}`, margin + 170, currentY);
    
    currentY += 15;
    
    // Add space between suppliers
    if (index < order.supplierBreakdown.length - 1) {
      currentY += 10;
    }
  });

  // Total
  currentY += 10;
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 15;
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Amount:', margin + 120, currentY);
  pdf.text(`$${order.totalCost.toFixed(2)}`, margin + 170, currentY);

  // Footer
  currentY += 30;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Thank you for your business!', margin, currentY);
  
  currentY += 8;
  pdf.text('For questions about this order, please contact support.', margin, currentY);

  // Save the PDF
  const fileName = `CoffeeCart-Invoice-${order.id}.pdf`;
  pdf.save(fileName);
};

export const generateOrderSummaryPDF = (order: Order): void => {
  const pdf = new jsPDF();
  
  // Set up the document
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let currentY = margin;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Order Summary', margin, currentY);
  
  currentY += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Order ID: ${order.id}`, margin, currentY);
  
  currentY += 8;
  pdf.text(`Status: ${order.status.toUpperCase()}`, margin, currentY);
  
  currentY += 8;
  pdf.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, margin, currentY);

  currentY += 20;

  // Delivery information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Delivery Information', margin, currentY);
  currentY += 12;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  order.supplierBreakdown.forEach(supplierOrder => {
    const supplier = mockSuppliers.find(s => s.id === supplierOrder.supplierId);
    if (!supplier) return;

    pdf.text(`• ${supplier.name}: ${new Date(supplierOrder.deliveryDate).toLocaleDateString()}`, margin + 5, currentY);
    currentY += 8;
  });

  currentY += 10;
  pdf.text(`Consolidated Window: ${new Date(order.deliveryWindow.start).toLocaleDateString()} - ${new Date(order.deliveryWindow.end).toLocaleDateString()}`, margin, currentY);

  // Save the PDF
  const fileName = `OneCart-Summary-${order.id}.pdf`;
  pdf.save(fileName);
};
