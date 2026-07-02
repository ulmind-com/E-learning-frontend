export const generateInvoice = (purchase, user) => {
  const invoiceHtml = `
    <html>
      <head>
        <title>Invoice - ${purchase.razorpayOrderId}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .header h1 { color: #E87C41; margin: 0; }
          .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .details div { width: 48%; }
          table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
          table th, table td { padding: 12px; border-bottom: 1px solid #ddd; }
          table th { background: #f9f9f9; font-weight: bold; }
          .total { font-weight: bold; color: #E87C41; font-size: 20px; text-align: right; margin-top: 20px; }
          .footer { margin-top: 50px; text-align: center; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <h1>E-Learning Platform</h1>
              <p>123 Education Street<br>Tech City, TC 10010</p>
            </div>
            <div style="text-align: right;">
              <h2>INVOICE</h2>
              <p>Order ID: ${purchase.razorpayOrderId}<br>Date: ${new Date(purchase.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="details">
            <div>
              <strong>Billed To:</strong><br>
              ${user.name}<br>
              ${user.email}<br>
              ${user.mobile || ''}
            </div>
            <div style="text-align: right;">
              <strong>Payment Method:</strong><br>
              Razorpay<br>
              Transaction ID: ${purchase.razorpayPaymentId || 'N/A'}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${purchase.course?.title || 'Unknown Course'}</td>
                <td style="text-align: right;">Rs ${purchase.amount}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            Total Paid: Rs ${purchase.amount}
          </div>

          <div class="footer">
            Thank you for learning with us!<br>
            If you have any questions concerning this invoice, contact support@elearning.com.
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '', 'height=800,width=800');
  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
};
