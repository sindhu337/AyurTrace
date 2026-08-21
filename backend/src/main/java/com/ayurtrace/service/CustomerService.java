package com.ayurtrace.service;

import com.ayurtrace.dto.ProductResponse;
import com.ayurtrace.entity.*;
import com.ayurtrace.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FavouriteRepository favouriteRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ManufacturerLoginRepository manufacturerLoginRepository;

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query) {
        List<Product> products;
        if (query == null || query.isEmpty()) {
            products = productRepository.findAll();
        } else {
            products = productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query);
        }
        
        return products.stream().map(p -> {
            String mfgCode = null;
            if (p.getManufacturer() != null) {
                mfgCode = manufacturerLoginRepository.findByRegistration(p.getManufacturer())
                        .map(ManufacturerLogin::getManufacturerId).orElse(null);
            }
            return ProductResponse.from(p, mfgCode);
        }).collect(Collectors.toList());
    }

    public Product getProductDetails(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Transactional
    public void addToFavourites(Customer customer, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (favouriteRepository.findByCustomerAndProduct(customer, product).isEmpty()) {
            Favourite favourite = new Favourite();
            favourite.setCustomer(customer);
            favourite.setProduct(product);
            favouriteRepository.save(favourite);
        }
    }

    @Transactional
    public void removeFromFavourites(Customer customer, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        favouriteRepository.findByCustomerAndProduct(customer, product)
                .ifPresent(favouriteRepository::delete);
    }

    public List<Product> getFavourites(Customer customer) {
        return favouriteRepository.findByCustomer(customer).stream()
                .map(Favourite::getProduct)
                .collect(Collectors.toList());
    }

    @Transactional
    public Cart addToCart(Customer customer, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    return cartRepository.save(newCart);
                });
        
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
        
        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }
        
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItem(Customer customer, Long productId, Integer quantity) {
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    if (quantity <= 0) {
                        cart.getItems().remove(item);
                    } else {
                        item.setQuantity(quantity);
                    }
                });
        
        return cartRepository.save(cart);
    }

    @Transactional
    public void removeFromCart(Customer customer, Long productId) {
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        cartRepository.save(cart);
    }

    public Cart getCart(Customer customer) {
        return cartRepository.findByCustomer(customer)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public Order checkout(Customer customer, String paymentMethod) {
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(paymentMethod.equals("COD") ? "PENDING" : "COMPLETED"); // Dummy net banking
        
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getProduct().getPrice());
            order.getItems().add(orderItem);
            
            total = total.add(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            
            // Update stock
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }
        
        order.setTotalAmount(total);
        orderRepository.save(order);
        
        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);
        
        return order;
    }

    public List<Order> getOrders(Customer customer) {
        return orderRepository.findByCustomerOrderByOrderDateDesc(customer);
    }
}
