let app1 = new Vue({
	el: "#vue-app",
	data(){
		return {

			subjects: [],
			cart: [],
			showProduct: true,
			order: {
					firstname: "", lastname: "", address: "", city: "", state: "", zip: "", method: "Home", gift: false, sendGift: 'Yes', dontSendGift: 'No',
			}                       
		}
	},
	methods:{
			addItemToCart(subject){
					this.cart.push(subject.id);
			},
			canAddToCart(subject){
					return subject.availableInventory > this.cartCount(subject.id);
			},
			showCheckout(){
					if(this.showProduct){
							this.showProduct = false;
					}
					else{
							this.showProduct = true;
					}
			},
			cartCount(id)
					{
							let count = 0;
							for (let i = 0; i < this.cart.length; i++)
							{
									if (this.cart[i] === id)
									{
											count ++
									}
							}
							return count;
					},
			submitCheckOut(){
					alert('Check-out completed successfully')
			}
	},

	created: function() {
			fetch("http://localhost:3000/collections1/Subjects")
					.then(response => response.json())
					.then(json => {
							this.subjects = json; 
							console.log(this.subjects);
					})
					.catch(error => {
							console.error("Error fetching data:", error);
					});
	},
	computed:{
			itemInCart: function(){
					return this.cart.length || "";
			},        
			sortedSubjects() {
							function compare(a, b) {
									if (a.price > b.price) return 1;
									if (a.price < b.price) return -1;
									return 0;
									}
							return this.subjects.sort(compare);
	}
	}
})