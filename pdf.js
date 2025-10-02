document.getElementById('btnDescargarPDF').addEventListener('click', function() {
      // Crear tabla temporal solo con las columnas requeridas
      const tablaOriginal = document.querySelector('#tablaParaPDF table');
      const filas = Array.from(tablaOriginal.rows);
      // Encabezados: Nombre, Extensión, Correo
      const indices = [0, 3, 4];
      const tablaTemp = document.createElement('table');
      tablaTemp.style.width = '100%';
      tablaTemp.style.borderCollapse = 'collapse';
      tablaTemp.style.fontSize = '1.15rem';
      tablaTemp.style.background = '#fff';
      // Encabezado
      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');
      indices.forEach(i => {
        const th = document.createElement('th');
        th.textContent = filas[0].cells[i].textContent;
        th.style.background = '#1F3471';
        th.style.color = '#fff';
        th.style.padding = '12px 10px';
        th.style.border = '2px solid #3F5984';
        th.style.fontWeight = 'bold';
        trHead.appendChild(th);
      });
      thead.appendChild(trHead);
      tablaTemp.appendChild(thead);
      // Cuerpo
      const tbody = document.createElement('tbody');
      for(let i=1; i<filas.length; i++) {
        const tr = document.createElement('tr');
        indices.forEach(j => {
          const td = document.createElement('td');
          td.innerHTML = filas[i].cells[j].innerHTML;
          td.style.padding = '12px 10px';
          td.style.border = '1.5px solid #8EA0B8';
          td.style.fontSize = '1.08rem';
          td.style.background = (i%2===0) ? '#8EA0B8' : '#fff';
          td.style.color = '#000';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }
      tablaTemp.appendChild(tbody);
      // Renderizar en canvas y PDF (vertical, sin encabezado ni footer)
      const contenedor = document.createElement('div');
      contenedor.style.padding = '12px';
      contenedor.style.background = '#fff';
      contenedor.style.borderRadius = '10px';
      contenedor.style.boxShadow = '0 2px 8px rgba(31,52,113,0.07)';
  contenedor.style.width = '1000px';
      contenedor.appendChild(tablaTemp);
      document.body.appendChild(contenedor);
      const { jsPDF } = window.jspdf;
      html2canvas(contenedor, {
        backgroundColor: '#fff',
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // vertical
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        // Calcular tamaño para ocupar casi toda la hoja
        let marginX = 7;
        let marginY = 7;
        let pdfWidth = pageWidth - marginX * 2;
        let pdfHeight = pageHeight - marginY * 2;
        // Ajustar proporción para que la tabla siempre llene la hoja
        const ratioCanvas = canvas.width / canvas.height;
        const ratioPDF = pdfWidth / pdfHeight;
        if (ratioCanvas > ratioPDF) {
          // La tabla es más ancha, ajustar por ancho
          pdfHeight = pdfWidth / ratioCanvas;
        } else {
          // La tabla es más alta, ajustar por alto
          pdfWidth = pdfHeight * ratioCanvas;
        }
        pdf.addImage(imgData, 'PNG', (pageWidth-pdfWidth)/2, (pageHeight-pdfHeight)/2, pdfWidth, pdfHeight);
        pdf.save('Extensiones_Jarmedical.pdf');
        document.body.removeChild(contenedor);
      });
    });
