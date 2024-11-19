import { Component, OnInit } from '@angular/core';
import { TransactionService } from "../../services/transaction.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-seller-offers',
  templateUrl: './seller-offers.component.html',
  styleUrls: ['./seller-offers.component.css']
})
export class SellerOffersComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  isLoading: boolean = false;
  userRole: string = '';
  selectedStatus: string = 'ALL';

  constructor(
    private transactionService: TransactionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';

    if (this.userRole === 'ROLE_SELLER' || this.userRole === 'ROLE_BUYER') {
      this.loadUserTransactions();
    } else {
      this.snackBar.open('Acceso denegado: No tienes permisos para ver esta sección.', 'Cerrar', { duration: 3000 });
    }
  }

  loadUserTransactions() {
    this.isLoading = true;
    this.transactionService.getTransactionsByUser().subscribe(
      (data: any) => {
        this.transactions = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : [];
        this.applyFilter();
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Error al cargar transacciones.', 'Cerrar', { duration: 3000 });
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  applyFilter() {
    if (this.selectedStatus === 'ALL') {
      this.filteredTransactions = this.transactions;
    } else {
      this.filteredTransactions = this.transactions.filter(
        (transaction) => transaction.paymentStatus === this.selectedStatus
      );
    }
  }

  updateTransactionStatus(transactionId: number, status: string) {
    this.transactionService.updateTransaction(transactionId, { status }).subscribe(
      () => {
        this.snackBar.open(
          status === 'COMPLETED' ? 'Transacción aceptada.' : 'Transacción cancelada.',
          'Cerrar',
          { duration: 3000 }
        );
        this.loadUserTransactions();
      },
      (error) => {
        this.snackBar.open(
          status === 'COMPLETED' ? 'Error al aceptar la transacción.' : 'Error al cancelar la transacción.',
          'Cerrar',
          { duration: 3000 }
        );
        console.error(error);
      }
    );
  }
}
